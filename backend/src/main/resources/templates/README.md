# Templates Folder

## Purpose

This folder contains **server-side rendered HTML templates** using template engines like Thymeleaf, Freemarker, or Mustache.

## When to Use Templates

### ✅ Use Templates For:
1. **Email Templates** - Welcome emails, password reset, notifications
2. **PDF Generation** - Invoices, reports, certificates
3. **Server-Side Rendered Pages** - Admin dashboards, error pages
4. **Dynamic HTML** - Content that needs server-side data injection

### ❌ Don't Use Templates For:
1. **Main Frontend** - Use Angular (already in frontend/ folder)
2. **REST API Responses** - Use JSON
3. **Static Content** - Use static/ folder

---

## Example: Email Template

### Template File: `templates/email/welcome.html`
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Welcome to RevPlay</title>
</head>
<body>
    <h1>Welcome, <span th:text="${username}">User</span>!</h1>
    <p>Thank you for joining RevPlay.</p>
    <p>Your account has been created successfully.</p>
    <a th:href="${loginUrl}">Login Now</a>
</body>
</html>
```

### Controller:
```java
@Service
public class EmailService {
    
    @Autowired
    private TemplateEngine templateEngine;
    
    public String generateWelcomeEmail(String username, String loginUrl) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("loginUrl", loginUrl);
        return templateEngine.process("email/welcome", context);
    }
}
```

---

## Setup Thymeleaf (Optional)

If you want to use templates, add to `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

---

## Current Project

**RevPlay uses Angular for frontend**, so this folder is optional and mainly for:
- Email notifications
- PDF reports
- Admin tools

The main user interface is in `frontend/` folder (Angular).
