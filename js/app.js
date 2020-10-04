
var currentUserKey = '';
var chatKey = '';

var currentUser = '';

document.getElementById('txtName').focus();

var sign = '';

function showChatList() {
    document.getElementById('friendList').classList.remove('d-none', 'd-md-block')
    document.getElementById('startDiv').setAttribute('style', 'display:none')
}

// Show FriendList
function getFriendList() {
       var db = firebase.database().ref('users');
        db.on('value', function (users) {
            var lst = '';
            users.forEach(function (data) {

                var user = data.val();
                if (user.email !== firebase.auth().currentUser.email) {

                    lst += `
                            <li  class="list-group-item list-group-item-action " key="${data.key}" >          
                            <div class="row">
                            <div class="col-2 col-sm-2 col-md-2">
                            <img class="friend-pic rounded-circle " src="${user.photoURL}" alt="">
                            </div>
                            <div class="col-10 col-sm-10 col-md-10 d-none d-md-block text-dark ">
                            <div class="name" style="margin-top:12px;">  ${user.name}</div>
                            </div>
                            </div>
                            </li>
                            `;
                }
            });
            document.getElementById('showFriendList').innerHTML = lst;
        });
    
}

var txtName = document.getElementById('txtName');
txtName.addEventListener('keydown', function (event) {
    if (event.key === "Enter" || event.keyCode === 13) {
        {
            sendMessage();
            console.log("worked")
        }
    }
});


function sendMessage() {
    var chatMessage = {
        userId: currentUserKey,
        message: document.getElementById('txtName').value,
        dataTime: new Date().toLocaleString(),
        photoURL: firebase.auth().currentUser.photoURL,
        name: firebase.auth().currentUser.displayName
    }
    firebase.database().ref('friend-chat').push(chatMessage, function (error) {
        if (error) {
            console.error();
        } else {

        }
    });

}
loadMessage();

function loadMessage() {
    var db = firebase.database().ref('friend-chat');
    db.on('value', function (friend) {
        var innerchat = '';
 
        friend.forEach(function (data) {
           
            var user = data.val();
            if (user.userId !== currentUserKey) {
                 innerchat += ` <div class="row receive"> 
                    <div class="col-2 col-sm-2 col-md-2">
                        <img src="${user.photoURL}" class="profile-pic">
                    </div>
                    
                    <div class="col-8 col-sm-8 col-md-4 message ">
                    <p class="mt-1">${user.message}</p>
                    <span class="time float-right">${user.dataTime}</span>    
                    </div>  
                    </div>`
            } else {
                console.log('else part')
                innerchat += `<div class="row send justify-content-end"> 
                            <div class="col-8 col-sm-8 col-md-4 message "style="background:rgba(31, 91, 255, 0.767);
                            color:White;">
                            <p class="">${user.message}</p>
                            <span class="time float-left text-white"> ${user.dataTime}</span>    
                            </div>  
            
                            <div class="col-2 col-sm-2 col-md-2 ">
                                <img src="${user.photoURL}" class="profile-pic">
                            </div>                    
                            </div>`

            }
            document.getElementById('txtName').value = ""
            document.getElementById('txtName').focus();
            document.getElementById('messages-list').scrollTo(0, 1000 * 1000);
            document.getElementById("messages-list").innerHTML = innerchat;
        });   
    });
 //   document.getElementById("messages-list").innerHTML = innerchat;
       
}


firebase.database().ref('friend-chat').on("child_removed", function (snapshot) {
    document.getElementById("del-" + snapshot.key).innerHTML = "message deleted";
});

function deleteBtn(self) {
    var id = self.getAttribute("data");
    //let deleteRef= firebase.database().ref("Students/"+id);
    //deleteRef.remove();
    firebase.database().ref('friend-chat').child(id).remove();
}



function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function () {
        var html = '';

        document.getElementById('current-User').innerText = firebase.auth().currentUser.displayName;
        
        loadMessage();
        // if (sign === true) {
        //         var db = firebase.database().ref('friend-chat');
        //         db.on('value', function (friend) {
        //         friend.forEach(function (data) {
        //             if(check===true){
        //                 var user = data.val();

        //             html =  `
        //             <div class="row send"> 
        //             <div class="col-2 col-sm-2 col-md-2">
        //                 <img src="${user.photoURL}" class="profile-pic">
        //             </div>

        //             <div class="col-8 col-sm-8 col-md-4 message ">
        //                 <p class="">${user.message}</p>
        //                 <span class="time float-right"> ${user.dataTime}</span>    
        //             </div>  
        //         </div>
        //     `;
        //             document.getElementById('messages-list').innerHTML += html;
        //             }
        //         });
        //         check= false;
        //     });
        // }
    });
}
function showList() {
    if (sign === true) {
        var db = firebase.database().ref('friend-list');
        db.on('value', function (friend) {
            friend.forEach(function (data) {
                var user = data.val();
            });
        });
    }
}
function signOut() {
    firebase.auth().signOut().then(function () {
        console.log("sign out")
     
        document.getElementById('profile-pic').src = "images/picLogo.png"

        document.getElementById('lnkSignIn').setAttribute('style', 'display: block');
        document.getElementById('lnkSignOut').setAttribute('style', 'display: none');

        document.getElementById('showFriendList').innerHTML = '';
        document.getElementById('currentUser').innerText = '';

       // document.getElementById('messages-list').innerHTML = '';

    }).catch(function (error) {

    });
}
function onFirebaseStateChanged() {
    firebase.auth().onAuthStateChanged(onStateChanged);
}

function onStateChanged(user) {
    if (user) {
        document.getElementById('current-User').innerText = firebase.auth().currentUser.displayName;

        var flag = false;
        getFriendList()
        var userProfile = { email: '', name: '', photoURL: '' }
        userProfile.email = firebase.auth().currentUser.email;
        userProfile.name = firebase.auth().currentUser.displayName;
        userProfile.photoURL = firebase.auth().currentUser.photoURL;

        var db = firebase.database().ref('users');
        db.on('value', function (users) {
            users.forEach(function (data) {
                var user = data.val();
                if (user.email === userProfile.email) {
                    flag = true;
                    currentUserKey = data.key;


                    document.getElementById('lnkSignIn').setAttribute('style', 'display: none');
                    document.getElementById('lnkSignOut').setAttribute('style', 'display: block');

                }
            });
            if (flag === false) {
                firebase.database().ref('users').push(userProfile, callback);
            }
        });
        // alert(firebase.auth().currentUser.email+'/n'+firebase.auth().currentUser.displayName)
        document.getElementById('profile-pic').src = firebase.auth().currentUser.photoURL;
        document.getElementById('profile-pic').title = firebase.auth().currentUser.displayName;
    }
}

function callback(error) {
    if (error) {
        console.log(error)
    } else {
        document.getElementById('profile-pic').src = firebase.auth().currentUser.photoURL;
        document.getElementById('profile-pic').title = firebase.auth().currentUser.displayName;
        // alert();

        document.getElementById('lnkSignIn').setAttribute('style', 'display: none');
        document.getElementById('lnkSignOut').setAttribute('style', 'display: block');


    }
}
onFirebaseStateChanged();
