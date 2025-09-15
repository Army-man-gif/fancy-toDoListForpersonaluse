from django.urls import path,include
from . import views
urlpatterns = [
    path('', views.records_home, name='records_home'),
    path("setToken/",views.setToken,name="setToken"),
    path("getToken/",views.get_csrf_token,name="getToken"),
    
    path("GetorMakeUser/", views.GetorMakeUser,name="GetorMakeUser"),
    
    path("login/", views.loginView,name="login"),
    path("logout/", views.logoutView,name="logout"),

    path("getData/", views.getData,name="getData"),
    path("cleanAll/", views.logoutView,name="cleanAll"),
    path("deleteSpecific/", views.logoutView,name="deleteSpecific"),

    path("batchUpdateTasks/", views.batchUpdateTasks,name="batchUpdateTasks"),

]