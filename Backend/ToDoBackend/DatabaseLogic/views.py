from django.middleware.csrf import get_token
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.models import User
from django.contrib.auth import login,logout
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password
import traceback
import json
from .models import Tasks
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
@csrf_exempt
def get_csrf_token(request):
    token = get_token(request)
    response = JsonResponse({'csrftoken': token})
    response.set_cookie(
        'csrftoken', token, samesite='None', secure=True, httponly=False
    )
    return response
@ensure_csrf_cookie
@require_GET
def setToken(request):
    # Sets the cookie on the frontend device
    return JsonResponse({"detail":"CSRF token set"})
def GetorMakeUser(request):
    if(request.method != "POST"):
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    else:
        try:
            data = json.loads(request.body)
            username = data.get("username")
            user,created = User.objects.get_or_create(username=username)
            user.save()
            login(request, user)
            if not request.session.session_key:
                request.session.save()
            sessionid = request.session.session_key
            csrftoken = get_token(request)
            message = "User created and logged in" if created else "User fetched and logged in"
            userDataToReturn = {"username":user.username,"sessionid":sessionid,"csrftoken":csrftoken,"status":message}
            return JsonResponse(userDataToReturn)
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({"error":str(e)},status=400)
# ----------------------------------------------------------------------------------------
def loginView(request):
    if(request.method != "POST"):
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    else:
        try:
            data = json.loads(request.body)
            username = data.get("username")
            user = User.objects.get(username=username)
            login(request, user)
            if not request.session.session_key:
                request.session.save()
            sessionid = request.session.session_key
            csrftoken = get_token(request)
            return JsonResponse({"message":"User logged in","sessionid":sessionid,"csrftoken":csrftoken})
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)
        except Exception as e:
            return JsonResponse({"error":str(e)},status=400)
def logoutView(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error":"User not logged in yet"})
    else:
        logout(request)
        return JsonResponse({"message": "User logged out"})
def getData(request):
    if(request.method != "POST"):
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    if(not request.user.is_authenticated):
        return JsonResponse({"error":"User not logged in yet"})
    else:
        TasksFound = Tasks.objects.filter(user=request.user.username).values()
        TasksFound = list(TasksFound)
        return JsonResponse({"message":"done","Tasks":TasksFound})
def cleanAll(request):
    if(not request.user.is_authenticated):
        return JsonResponse({"error":"User not logged in yet"})
    else:
        count,details = Tasks.objects.filter(user=request.user.username).delete()
        return JsonResponse({"TotalObjDeleted":count,"details":details})
def deleteSpecific(request):
    if(request.method != "POST"):
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    if(not request.user.is_authenticated):
        return JsonResponse({"error":"User not logged in yet"})
    else:
        data = json.loads(request.body)
        ID = data.get("id")
        name = data.get("name")
        if(ID):
            Task = Tasks.objects.get(user=request.user.username,id=ID)
            message = f"'${Task.name}' task deleted by ID"
            Task.delete()
            return JsonResponse({"message":message})
        elif(name):
            Task = Tasks.objects.get(user=request.user.username,name=name)
            message = f"'${Task.name}' task deleted by name"
            Task.delete()
            return JsonResponse({"message":message})
        else:
            return JsonResponse({"error":"Either the ID or name field need to ahve a value"})
def batchUpdateTasks(request):
    if(request.method != "POST"):
        return JsonResponse({"error": "Only POST allowed"}, status=405)
    if(not request.user.is_authenticated):
        return JsonResponse({"error":"User not logged in yet"})
    else:
        data = json.loads(request.body)
        batchupdateData = data.get("batchUpdate",None)
        if(batchupdateData is not None):
            results = []
            for task in batchupdateData:
                taskObj, created = Tasks.objects.update_or_create(
                    user=request.user,
                    name=task.get("name", ""),
                    defaults={
                        "myDay": task.get("myDay", False),
                        "isStarred": task.get("isStarred", False),
                        "isChecked": task.get("isChecked", False),
                    }
                )
                results.append({
                    "name": taskObj.name,
                    "created": created,
                })
            return JsonResponse({"success":True,"results": results})
        return JsonResponse({"error": "No batchUpdate data provided"}, status=400)

