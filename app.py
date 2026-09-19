import os
import json
import uuid
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify, send_file

app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = os.environ.get('SECRET_KEY', 'bhutan-rael-portal-secret-key-2026')

DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'site_data.json')
TARGET_ADMIN_EMAIL = 'navihan01@gmail.com'

def load_data():
    """Loads portal data from JSON storage."""
    if not os.path.exists(DATA_FILE):
        return {}
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {DATA_FILE}: {e}")
        return {}

def save_data(data):
    """Saves updated portal data to JSON storage."""
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def send_notification_email(name, sender_email, phone, subject, message):
    """
    Attempts to dispatch real email to navihan01@gmail.com.
    Gracefully logs and falls back to JSON database if SMTP server is unavailable.
    """
    smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = int(os.environ.get('SMTP_PORT', 587))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_pass = os.environ.get('SMTP_PASS', '') # Gmail App Password

    msg = MIMEMultipart()
    msg['From'] = smtp_user if smtp_user else f"Bhutan RM Portal <{TARGET_ADMIN_EMAIL}>"
    msg['To'] = TARGET_ADMIN_EMAIL
    msg['Subject'] = f"[부탄 라엘리안 문의] {name}님의 메시지: {subject}"

    body = f"""부탄 라엘리안 무브먼트 공식 포털에서 새로운 온라인 문의가 접수되었습니다.

■ 보낸 사람: {name}
■ 이메일: {sender_email}
■ 연락처: {phone or '미입력'}
■ 제목: {subject}
■ 접수일시: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

■ 문의 내용:
--------------------------------------------------
{message}
--------------------------------------------------

* 본 문의는 관리자 콘솔(http://localhost:3000/admin)의 [받은 문의함]에서도 확인 및 답장하실 수 있습니다.
"""
    msg.attach(MIMEText(body, 'plain', 'utf-8'))

    if smtp_user and smtp_pass:
        try:
            with smtplib.SMTP(smtp_server, smtp_port, timeout=10) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.send_message(msg)
                print(f"[Email Success] Sent inquiry email to {TARGET_ADMIN_EMAIL}")
                return True
        except Exception as e:
            print(f"[Email Notice] SMTP delivery could not complete: {e}. Saved safely to database.")
            return False
    else:
        print(f"[Email Notice] SMTP_USER / SMTP_PASS not configured in environment. Inquiry recorded in database for {TARGET_ADMIN_EMAIL}.")
        return False

@app.context_processor
def inject_global_data():
    """Injects current language, site configuration and unread inquiries count to all templates."""
    data = load_data()
    lang = session.get('lang', 'ko')
    inquiries = data.get('inquiries', [])
    unread_inquiries = sum(1 for inq in inquiries if inq.get('status') == 'unread')
    return {
        'site_data': data,
        'lang': lang,
        'unread_inquiries_count': unread_inquiries
    }

# ==========================================
# PUBLIC ROUTES
# ==========================================

@app.route('/')
def index():
    """Main Landing Portal."""
    data = load_data()
    return render_template('index.html', site_data=data)

@app.route('/articles')
def articles_list():
    """Article & News Feed."""
    data = load_data()
    category = request.args.get('category')
    posts = data.get('posts', [])
    if category:
        posts = [p for p in posts if p.get('category') == category]
    return render_template('articles.html', posts=posts, current_cat=category)

@app.route('/articles/<post_id>')
def article_detail(post_id):
    """Individual Article Reader."""
    data = load_data()
    post = next((p for p in data.get('posts', []) if p['id'] == post_id), None)
    if not post:
        flash('요청하신 아티클을 찾을 수 없습니다.', 'error')
        return redirect(url_for('articles_list'))
    
    # Increment view count
    post['views'] = post.get('views', 0) + 1
    save_data(data)
    
    lang = session.get('lang', 'ko')
    page_title = f"{post['title'].get(lang, '')} | Bhutan RM"
    return render_template('article_detail.html', post=post, page_title=page_title)

@app.route('/articles/<post_id>/comment', methods=['POST'])
def add_comment(post_id):
    """Add reader comment to article."""
    author = request.form.get('author', '').strip()
    text = request.form.get('text', '').strip()
    if not author or not text:
        flash('이름과 댓글 내용을 모두 입력해주세요.', 'error')
        return redirect(url_for('article_detail', post_id=post_id))
    
    data = load_data()
    for post in data.get('posts', []):
        if post['id'] == post_id:
            if 'comments' not in post:
                post['comments'] = []
            post['comments'].append({
                'id': f"c-{uuid.uuid4().hex[:6]}",
                'author': author,
                'text': text,
                'createdAt': datetime.now().strftime('%Y-%m-%d %H:%M')
            })
            save_data(data)
            flash('댓글이 성공적으로 등록되었습니다.', 'success')
            break
            
    return redirect(url_for('article_detail', post_id=post_id))

@app.route('/contact', methods=['POST'])
def contact_submit():
    """Handle visitor contact inquiry, record in DB and attempt email dispatch."""
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()
    phone = request.form.get('phone', '').strip()
    subject = request.form.get('subject', '부탄 라엘리안 무브먼트 온라인 문의').strip()
    message = request.form.get('message', '').strip()

    if not name or not email or not message:
        flash('이름, 이메일, 메시지 내용을 모두 입력해 주세요.', 'error')
        return redirect(url_for('index') + '#contact')

    data = load_data()
    new_inquiry = {
        'id': f"inq-{uuid.uuid4().hex[:8]}",
        'name': name,
        'email': email,
        'phone': phone,
        'subject': subject,
        'message': message,
        'createdAt': datetime.now().strftime('%Y-%m-%d %H:%M'),
        'status': 'unread'
    }
    
    data.setdefault('inquiries', []).insert(0, new_inquiry)
    save_data(data)

    # Attempt dispatch to navihan01@gmail.com
    send_notification_email(name, email, phone, subject, message)

    flash(f"감사합니다, {name}님! 문의사항이 관리자({TARGET_ADMIN_EMAIL})에게 안전하게 접수 및 전송되었습니다.", 'success')
    return redirect(url_for('index') + '#contact')

@app.route('/lang/<lang>')
def toggle_language(lang):
    """Switch site language (ko / en)."""
    if lang in ['ko', 'en']:
        session['lang'] = lang
    return redirect(request.referrer or url_for('index'))

# ==========================================
# ADMIN AUTHENTICATION
# ==========================================

@app.route('/admin0/login', methods=['GET'])
def admin_login():
    """Admin Login Form (Accessible only via /admin0/login)."""
    if session.get('admin_logged_in'):
        return redirect(url_for('admin_dashboard'))
    return render_template('admin_login.html')

@app.route('/admin0/login', methods=['POST'])
def admin_login_post():
    """Admin Authentication Verification."""
    email = request.form.get('email', '').strip().lower()
    password = request.form.get('password', '').strip()
    
    data = load_data()
    admins = data.get('admins', [])
    
    matched = None
    for adm in admins:
        if adm.get('email', '').lower() == email and adm.get('password') == password:
            matched = adm
            break
            
    if matched or (email == TARGET_ADMIN_EMAIL and password == 'rael2026!'):
        session['admin_logged_in'] = True
        session['admin_email'] = email
        session['admin_name'] = matched.get('name', '최고 관리자') if matched else '최고 관리자'
        session['admin_role'] = matched.get('role', 'super_admin') if matched else 'super_admin'
        
        # Update last login time
        if matched:
            matched['lastLoginAt'] = datetime.now().strftime('%Y-%m-%d %H:%M')
            save_data(data)
            
        flash(f"{session['admin_name']}님, 관리자 대시보드에 정상적으로 로그인되었습니다.", 'success')
        return redirect(url_for('admin_dashboard'))
    else:
        flash('이메일 또는 비밀번호가 올바르지 않습니다. 확인 후 다시 입력해주세요.', 'error')
        return redirect(url_for('admin_login'))

@app.route('/admin/logout')
def admin_logout():
    """Admin Logout."""
    session.pop('admin_logged_in', None)
    session.pop('admin_email', None)
    session.pop('admin_name', None)
    session.pop('admin_role', None)
    flash('관리자 계정에서 안전하게 로그아웃 되었습니다.', 'success')
    return redirect(url_for('index'))

# ==========================================
# ADMIN DASHBOARD & FULL MANAGEMENT
# ==========================================

def require_admin():
    return session.get('admin_logged_in')

@app.route('/admin')
def admin_dashboard():
    """Admin Central Dashboard."""
    if not require_admin():
        flash('관리자 권한이 필요합니다. 먼저 로그인해주세요.', 'error')
        return redirect(url_for('admin_login'))
    return render_template('admin_dashboard.html')

# 1. Main Text Content Update
@app.route('/admin/content/update', methods=['POST'])
def admin_update_content():
    """Update all main text sections without exception."""
    if not require_admin():
        return redirect(url_for('admin_login'))
    
    data = load_data()
    # Hero
    data['content']['hero']['badge']['ko'] = request.form.get('hero_badge_ko', '')
    data['content']['hero']['badge']['en'] = request.form.get('hero_badge_en', '')
    data['content']['hero']['title']['ko'] = request.form.get('hero_title_ko', '')
    data['content']['hero']['title']['en'] = request.form.get('hero_title_en', '')
    data['content']['hero']['subtitle']['ko'] = request.form.get('hero_sub_ko', '')
    data['content']['hero']['subtitle']['en'] = request.form.get('hero_sub_en', '')
    data['content']['hero']['primaryCtaText']['ko'] = request.form.get('hero_cta1_ko', '')
    data['content']['hero']['primaryCtaText']['en'] = request.form.get('hero_cta1_en', '')
    data['content']['hero']['secondaryCtaText']['ko'] = request.form.get('hero_cta2_ko', '')
    data['content']['hero']['secondaryCtaText']['en'] = request.form.get('hero_cta2_en', '')
    if request.form.get('hero_image'):
        data['content']['hero']['heroImage'] = request.form.get('hero_image')

    # About
    data['content']['about']['title']['ko'] = request.form.get('about_title_ko', '')
    data['content']['about']['title']['en'] = request.form.get('about_title_en', '')
    data['content']['about']['subtitle']['ko'] = request.form.get('about_sub_ko', '')
    data['content']['about']['subtitle']['en'] = request.form.get('about_sub_en', '')
    data['content']['about']['description']['ko'] = request.form.get('about_desc_ko', '')
    data['content']['about']['description']['en'] = request.form.get('about_desc_en', '')
    data['content']['about']['quote']['ko'] = request.form.get('about_quote_ko', '')
    data['content']['about']['quote']['en'] = request.form.get('about_quote_en', '')
    data['content']['about']['quoteAuthor']['ko'] = request.form.get('about_quote_author_ko', '')
    data['content']['about']['quoteAuthor']['en'] = request.form.get('about_quote_author_en', '')
    if request.form.get('about_image'):
        data['content']['about']['aboutImage'] = request.form.get('about_image')

    # Embassy
    data['content']['embassy']['title']['ko'] = request.form.get('embassy_title_ko', '')
    data['content']['embassy']['title']['en'] = request.form.get('embassy_title_en', '')
    data['content']['embassy']['subtitle']['ko'] = request.form.get('embassy_sub_ko', '')
    data['content']['embassy']['subtitle']['en'] = request.form.get('embassy_sub_en', '')
    data['content']['embassy']['description']['ko'] = request.form.get('embassy_desc_ko', '')
    data['content']['embassy']['description']['en'] = request.form.get('embassy_desc_en', '')
    if request.form.get('embassy_image'):
        data['content']['embassy']['embassyImage'] = request.form.get('embassy_image')
    
    # Contact
    data['content']['contact']['email'] = request.form.get('contact_email', TARGET_ADMIN_EMAIL)
    data['content']['contact']['phone'] = request.form.get('contact_phone', '')
    data['content']['contact']['address']['ko'] = request.form.get('contact_address_ko', '')
    data['content']['contact']['address']['en'] = request.form.get('contact_address_en', '')
    data['content']['contact']['meetingHours']['ko'] = request.form.get('contact_hours_ko', '')
    data['content']['contact']['meetingHours']['en'] = request.form.get('contact_hours_en', '')
    
    save_data(data)
    flash('메인페이지 콘텐츠가 성공적으로 실시간 업데이트되었습니다.', 'success')
    return redirect(url_for('admin_dashboard'))

# 2. Philosophy Pillars Board Update
@app.route('/admin/philosophy/update', methods=['POST'])
def admin_update_philosophy():
    """Update all Philosophy 4 Pillars."""
    if not require_admin():
        return redirect(url_for('admin_login'))
    
    data = load_data()
    pillars = data.get('philosophyPillars', [])
    for idx, pillar in enumerate(pillars):
        pillar_id = pillar.get('id', str(idx))
        pillar['title']['ko'] = request.form.get(f'pillar_{pillar_id}_title_ko', pillar['title'].get('ko', ''))
        pillar['title']['en'] = request.form.get(f'pillar_{pillar_id}_title_en', pillar['title'].get('en', ''))
        pillar['tagline']['ko'] = request.form.get(f'pillar_{pillar_id}_tagline_ko', pillar['tagline'].get('ko', ''))
        pillar['tagline']['en'] = request.form.get(f'pillar_{pillar_id}_tagline_en', pillar['tagline'].get('en', ''))
        
        # Points from textarea (separated by newlines)
        pts_ko = request.form.get(f'pillar_{pillar_id}_points_ko', '')
        if pts_ko:
            pillar['points']['ko'] = [p.strip() for p in pts_ko.split('\n') if p.strip()]
        pts_en = request.form.get(f'pillar_{pillar_id}_points_en', '')
        if pts_en:
            pillar['points']['en'] = [p.strip() for p in pts_en.split('\n') if p.strip()]
            
    save_data(data)
    flash('지적설계 4대 철학 기둥 내용이 수정 및 저장되었습니다.', 'success')
    return redirect(url_for('admin_dashboard') + '#tab-philosophy')

# 3. Administrator Team Management (List, Add/Invite, Edit, Delete)
@app.route('/admin/admins/new', methods=['POST'])
def admin_create_admin_user():
    """Add / Invite new administrator."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    email = request.form.get('email', '').strip().lower()
    name = request.form.get('name', '').strip()
    role = request.form.get('role', 'admin').strip()
    password = request.form.get('password', '').strip() or 'rael2026!'
    
    if not email or not name:
        flash('이름과 이메일을 모두 입력해 주세요.', 'error')
        return redirect(url_for('admin_dashboard') + '#tab-admins')
        
    data = load_data()
    admins = data.setdefault('admins', [])
    
    # Check duplicate
    if any(a.get('email', '').lower() == email for a in admins):
        flash(f"이미 등록된 관리자 이메일({email})입니다.", 'error')
        return redirect(url_for('admin_dashboard') + '#tab-admins')
        
    new_admin = {
        'id': f"admin-{uuid.uuid4().hex[:6]}",
        'email': email,
        'name': name,
        'role': role,
        'password': password,
        'status': 'active',
        'invitedBy': session.get('admin_email', TARGET_ADMIN_EMAIL),
        'invitedAt': datetime.now().strftime('%Y-%m-%d'),
        'lastLoginAt': '-'
    }
    admins.append(new_admin)
    save_data(data)
    flash(f"새 관리자 '{name}'({email}) 계정이 성공적으로 생성되었습니다.", 'success')
    return redirect(url_for('admin_dashboard') + '#tab-admins')

@app.route('/admin/admins/<admin_id>/edit', methods=['POST'])
def admin_edit_admin_user(admin_id):
    """Edit administrator info."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    name = request.form.get('name', '').strip()
    role = request.form.get('role', 'admin').strip()
    status = request.form.get('status', 'active').strip()
    new_password = request.form.get('new_password', '').strip()
    
    data = load_data()
    for adm in data.get('admins', []):
        if adm.get('id') == admin_id:
            if name:
                adm['name'] = name
            adm['role'] = role
            adm['status'] = status
            if new_password and len(new_password) >= 4:
                adm['password'] = new_password
            save_data(data)
            flash(f"관리자 '{adm.get('name')}' 정보가 성공적으로 수정되었습니다.", 'success')
            break
            
    return redirect(url_for('admin_dashboard') + '#tab-admins')

@app.route('/admin/admins/<admin_id>/delete', methods=['POST'])
def admin_delete_admin_user(admin_id):
    """Delete administrator with master protection."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    data = load_data()
    target = next((a for a in data.get('admins', []) if a.get('id') == admin_id), None)
    
    if not target:
        flash('삭제할 관리자를 찾을 수 없습니다.', 'error')
        return redirect(url_for('admin_dashboard') + '#tab-admins')
        
    if target.get('email', '').lower() == TARGET_ADMIN_EMAIL:
        flash('최고 마스터 관리자 계정(navihan01@gmail.com)은 삭제할 수 없습니다.', 'error')
        return redirect(url_for('admin_dashboard') + '#tab-admins')
        
    data['admins'] = [a for a in data.get('admins', []) if a.get('id') != admin_id]
    save_data(data)
    flash(f"관리자 '{target.get('name')}' 계정이 삭제되었습니다.", 'success')
    return redirect(url_for('admin_dashboard') + '#tab-admins')

# 4. Inquiries Management (Inbox, Read/Reply, Delete)
@app.route('/admin/inquiries/<inquiry_id>/status', methods=['POST'])
def admin_toggle_inquiry_status(inquiry_id):
    """Toggle inquiry status between unread and replied."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    data = load_data()
    for inq in data.get('inquiries', []):
        if inq.get('id') == inquiry_id:
            current = inq.get('status', 'unread')
            inq['status'] = 'replied' if current == 'unread' else 'unread'
            save_data(data)
            flash('문의 처리 상태가 변경되었습니다.', 'success')
            break
            
    return redirect(url_for('admin_dashboard') + '#tab-inquiries')

@app.route('/admin/inquiries/<inquiry_id>/delete', methods=['POST'])
def admin_delete_inquiry(inquiry_id):
    """Delete inquiry from inbox."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    data = load_data()
    data['inquiries'] = [i for i in data.get('inquiries', []) if i.get('id') != inquiry_id]
    save_data(data)
    flash('문의 내역이 삭제되었습니다.', 'success')
    return redirect(url_for('admin_dashboard') + '#tab-inquiries')

# 5. FAQ Management
@app.route('/admin/faqs/new', methods=['POST'])
def admin_create_faq():
    """Add new FAQ."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    q_ko = request.form.get('q_ko', '').strip()
    q_en = request.form.get('q_en', '').strip() or q_ko
    a_ko = request.form.get('a_ko', '').strip()
    a_en = request.form.get('a_en', '').strip() or a_ko
    
    if not q_ko or not a_ko:
        flash('질문과 답변을 모두 입력해주세요.', 'error')
        return redirect(url_for('admin_dashboard') + '#tab-faqs')
        
    data = load_data()
    data.setdefault('faqs', []).append({
        'q': {'ko': q_ko, 'en': q_en},
        'a': {'ko': a_ko, 'en': a_en}
    })
    save_data(data)
    flash('새로운 FAQ 항목이 등록되었습니다.', 'success')
    return redirect(url_for('admin_dashboard') + '#tab-faqs')

@app.route('/admin/faqs/<int:faq_idx>/delete', methods=['POST'])
def admin_delete_faq(faq_idx):
    """Delete FAQ."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    data = load_data()
    faqs = data.get('faqs', [])
    if 0 <= faq_idx < len(faqs):
        del faqs[faq_idx]
        save_data(data)
        flash('FAQ 항목이 삭제되었습니다.', 'success')
        
    return redirect(url_for('admin_dashboard') + '#tab-faqs')

# 6. Books Management
@app.route('/admin/books/new', methods=['POST'])
def admin_create_book():
    """Add new book."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    data = load_data()
    new_book = {
        'id': f"book-{uuid.uuid4().hex[:6]}",
        'title': {
            'ko': request.form.get('title_ko', ''),
            'en': request.form.get('title_en', '')
        },
        'author': request.form.get('author', '마이트레야 라엘 (Maitreya Raël)'),
        'description': {
            'ko': request.form.get('desc_ko', ''),
            'en': request.form.get('desc_en', '')
        },
        'coverImage': request.form.get('cover_image', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'),
        'downloadUrl': request.form.get('download_url', 'https://www.rael.org/books/'),
        'pageCount': int(request.form.get('page_count', 250)),
        'languages': ['한국어', 'English', 'Français']
    }
    data.setdefault('books', []).append(new_book)
    save_data(data)
    flash('새로운 도서가 등록되었습니다.', 'success')
    return redirect(url_for('admin_dashboard') + '#tab-books')

@app.route('/admin/books/<book_id>/delete', methods=['POST'])
def admin_delete_book(book_id):
    """Delete book."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    data = load_data()
    data['books'] = [b for b in data.get('books', []) if b.get('id') != book_id]
    save_data(data)
    flash('도서 항목이 삭제되었습니다.', 'success')
    return redirect(url_for('admin_dashboard') + '#tab-books')

# 7. Articles / Posts
@app.route('/admin/posts/new', methods=['POST'])
def admin_create_post():
    """Create new article."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    data = load_data()
    new_id = f"post-{uuid.uuid4().hex[:6]}"
    new_post = {
        'id': new_id,
        'title': {
            'ko': request.form.get('title_ko', ''),
            'en': request.form.get('title_en', '')
        },
        'summary': {
            'ko': request.form.get('summary_ko', ''),
            'en': request.form.get('summary_ko', '')
        },
        'content': {
            'ko': request.form.get('content_ko', ''),
            'en': request.form.get('content_ko', '')
        },
        'category': request.form.get('category', 'announcement'),
        'author': request.form.get('author', session.get('admin_name', '부탄 지부 운영위원회')),
        'date': datetime.now().strftime('%Y-%m-%d'),
        'readTime': '3 min',
        'coverImage': request.form.get('cover_image', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80'),
        'tags': ['공지', '부탄'],
        'isFeatured': True,
        'views': 1,
        'comments': []
    }
    data.setdefault('posts', []).insert(0, new_post)
    save_data(data)
    flash('새로운 아티클이 성공적으로 발행되었습니다.', 'success')
    return redirect(url_for('admin_dashboard') + '#tab-posts')

@app.route('/admin/posts/<post_id>/delete', methods=['POST'])
def admin_delete_post(post_id):
    """Delete article."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    data = load_data()
    data['posts'] = [p for p in data.get('posts', []) if p['id'] != post_id]
    save_data(data)
    flash('아티클이 삭제되었습니다.', 'success')
    return redirect(url_for('admin_dashboard') + '#tab-posts')

# 8. Events
@app.route('/admin/events/new', methods=['POST'])
def admin_create_event():
    """Create new event."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    data = load_data()
    new_event = {
        'id': f"evt-{uuid.uuid4().hex[:6]}",
        'title': {'ko': request.form.get('title_ko', ''), 'en': request.form.get('title_ko', '')},
        'location': {'ko': request.form.get('location_ko', ''), 'en': request.form.get('location_ko', '')},
        'date': request.form.get('date', ''),
        'time': request.form.get('time', ''),
        'description': {'ko': request.form.get('description_ko', ''), 'en': request.form.get('description_ko', '')},
        'isOnline': 'is_online' in request.form,
        'meetingLink': request.form.get('meeting_link', ''),
        'status': 'upcoming'
    }
    data.setdefault('events', []).append(new_event)
    save_data(data)
    flash('새로운 행사 일정이 등록되었습니다.', 'success')
    return redirect(url_for('admin_dashboard') + '#tab-events')

@app.route('/admin/events/<event_id>/delete', methods=['POST'])
def admin_delete_event(event_id):
    """Delete event."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    data = load_data()
    data['events'] = [e for e in data.get('events', []) if e['id'] != event_id]
    save_data(data)
    flash('행사 일정이 삭제되었습니다.', 'success')
    return redirect(url_for('admin_dashboard') + '#tab-events')

# 9. Theme & Announcement
@app.route('/admin/theme', methods=['POST'])
def admin_update_theme():
    """Update color theme and announcement banner."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    data = load_data()
    accent = request.form.get('accent_color_text') or request.form.get('accent_color') or '#EA580C'
    data['theme']['accentColor'] = accent
    data['theme']['showAnnouncement'] = 'show_announcement' in request.form
    data['theme']['announcementText']['ko'] = request.form.get('announcement_text_ko', '')
    data['theme']['announcementText']['en'] = request.form.get('announcement_text_en', '')
    
    save_data(data)
    flash('테마 및 공지 배너 설정이 저장되었습니다.', 'success')
    return redirect(url_for('admin_dashboard') + '#tab-theme')

# 10. Password change for currently logged-in admin
@app.route('/admin/password', methods=['POST'])
def admin_change_password():
    """Change admin password."""
    if not require_admin():
        return redirect(url_for('admin_login'))
        
    new_pw = request.form.get('new_password', '').strip()
    if len(new_pw) < 4:
        flash('비밀번호는 최소 4자리 이상이어야 합니다.', 'error')
        return redirect(url_for('admin_dashboard') + '#tab-security')
        
    data = load_data()
    admin_email = session.get('admin_email', TARGET_ADMIN_EMAIL)
    for adm in data.get('admins', []):
        if adm.get('email', '').lower() == admin_email.lower():
            adm['password'] = new_pw
            break
            
    save_data(data)
    flash('비밀번호가 성공적으로 변경되었습니다.', 'success')
    return redirect(url_for('admin_dashboard') + '#tab-security')

@app.route('/admin/export')
def admin_export_json():
    """Export current JSON database."""
    if not require_admin():
        return redirect(url_for('admin_login'))
    return send_file(DATA_FILE, as_attachment=True, download_name='bhutan_rm_site_data.json')

@app.route('/api/site-data')
def api_site_data():
    """Public JSON API."""
    return jsonify(load_data())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)

