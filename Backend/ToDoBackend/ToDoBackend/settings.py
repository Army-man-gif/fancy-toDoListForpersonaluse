from pathlib import Path
import os
from dotenv import load_dotenv
import dj_database_url


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, ".env"))


DEBUG = False

SECRET_KEY = os.environ.get("SECRET_KEY","")
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS","").split(",")
CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS","").split(",")
CSRF_TRUSTED_ORIGINS = os.environ.get("CSRF_TRUSTED_ORIGINS","").split(",")
DATABASE_URL = os.environ.get("DATABASE_URL","")

CSRF_COOKIE_SECURE = True      
CSRF_COOKIE_SAMESITE = "None"
CSRF_COOKIE_HTTPONLY = False
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = "None"


from corsheaders.defaults import default_headers  
CORS_ALLOW_HEADERS = list(default_headers) + [  
    "x-sessionid",  
    "x-csrftoken",  
]
CORS_ALLOW_CREDENTIALS = True
SECURE_SSL_REDIRECT = True

ROOT_URLCONF = "ToDoBackend.urls"

WSGI_APPLICATION = "ToDoBackend.wsgi.application"

INSTALLED_APPS = [
    "DatabaseLogic",
    "corsheaders",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "DatabaseLogic.middleware.CustomMiddleware.CustomCsrfMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
#"django.middleware.csrf.CsrfViewMiddleware",



TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]




DATABASES = {
    "sqliteConfig": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    },
    "default": dj_database_url.config(
        default=DATABASE_URL
    )
}


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True



STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"