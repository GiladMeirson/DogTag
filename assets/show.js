ProfileData=null;
const validProfileURL = `https://proj.ruppin.ac.il/cgroup41/test2/tar1/api/Profiles/ValidProfile?Id=`;
const prefixPhoto=`https://proj.ruppin.ac.il/cgroup41/test2/tar1/uploadedFiles/`;
const SendPassMail = `https://proj.ruppin.ac.il/cgroup41/test2/tar1/api/Profiles/GetPassByID`;
$(document).ready(function() {
    $('.loader-overlay').hide();
    ProfileData = JSON.parse(sessionStorage.getItem('profileData'));
    var modal = document.getElementById('modal');
    var closeBtn = document.getElementsByClassName('close')[0];
    let closePass = document.getElementsByClassName('close')[1];
    var notifyBtnModal = document.getElementById('notifyOwnerModal');
    var notifyBtnPage = document.getElementById('notifyOwnerPage');
    if (ProfileData!=null) {
        RenderDetails();
    }

   
    modal.style.display = 'block';

    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    closePass.onclick = function() {
        $('#passModal').hide();
    }

    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    $('#editProfileBTN').click(()=>{
        $('#passModal').show();
    })

    $('#passBTN').click(()=>{
        const pass = $('#passIN').val();
        const url = validProfileURL+ProfileData.id;
        $.ajax({
            url: url,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(pass),
            success: function(data) {
                if (data) {
                    $('#passModal').hide();
                    $('#passIN').val('');
                    //console.log(data);
                    
                    if (data) {
                        sessionStorage.setItem('profileData', JSON.stringify(ProfileData));
                        location.href = 'edit.html';
                    }
                }
            },
            error: function(err) {
                swal.fire({
                    title: 'סיסמה שגויה',
                    text: 'נסה שוב',
                    icon: 'error',
                    confirmButtonText: 'אישור'
                });
                console.error(err);
            }
        });

    })


    $('#forgotPassA').click(()=>{
        $('#passModal').hide();
        $('.loader-overlay').show();
        $.ajax({
            url: SendPassMail,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(ProfileData.id),
            success: function(data) {
                $('.loader-overlay').hide();
                //console.log(data);
                if (data) {
                    let body = `<h1>שלום ${ProfileData.ownerName},</h1> <br> <h2>הסיסמא שלך לפרופיל של ${ProfileData.petName} היא: ${data}</h2> <br> <h3>אנא שמור על הסיסמא במקום בטוח ואל תחשוף אותה לאף אחד</h3>`;
                    Email.send({
                        SecureToken:'9512cd3e-b42e-4791-8bb0-7294b2bc2dfb',
                        To: ProfileData.ownerEmail,
                        From: "gilad.meirson@gmail.com",
                        Subject: `שחזור סיסמא לפרופיל של ${ProfileData.petName}`,
                        Body:body,
                    }).then(()=>{
                        swal.fire({
                            title: 'הסיסמא נשלחה למייל של הבעלים',
                            text: 'בדוק את המייל שלך, אם עדיין אינך רואה את הסיסמא במייל תנסה שוב או תבדוק את תיקיית הספאם (דואר זבל) במייל.',
                            icon: 'success',
                            confirmButtonText: 'אישור'
                        });
                    })

                }
            },
            error: function(err) {
                $('.loader-overlay').hide();
                swal.fire({
                    title: 'שגיאה',
                    text: 'אירעה שגיאה בשליחת הסיסמא, אנא נסה שוב',
                    icon: 'error',
                    confirmButtonText: 'אישור'
                });
                console.error(err);
            }
        });
    });




    function handleNotifyClick() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var ownerEmail = ProfileData.ownerEmail; 
                var ownerName = ProfileData.ownerName;
                var petName = ProfileData.petName;
                //console.log(lat, lon, ownerEmail, ownerName, petName);
                //reverseGeocodeAndSendEmail(lat, lon, ownerEmail, ownerName, petName);
                getPreciseAddress(lat, lon).then(preciseAddress => {
                    //console.log(preciseAddress);
                    let googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                    //console.log(googleMapsUrl);
                    let subject = `מצאו את ${petName}! 🐾`;
                    let h1='';
                    let h2='';
                    let h3='';
                    ProfileData.petGender=='female'?h1 = `<h1 style="text-align:center;">שלום ${ownerName}, ${petName} אבדה,</h1> <br>`:h1 = `<h1 style="text-align:center;">שלום ${ownerName}, ${petName} אבד,</h1> <br>`;
                    ProfileData.petGender=='female'?h2=`<h2 style="text-align:center;">אך אל דאגה מצאו אותה! 🎉</h2> <br>`:h2=`<h2 style="text-align:center;">אך אל דאגה מצאו אותו! 🎉</h2> <br>`;
                    ProfileData.petGender == 'female'?h3=`<h2 style="text-align:center;">והברקוד שלה נסרק ב-</h2>`:h3=`<h2 style="text-align:center;">והברקוד שלו נסרק ב-</h2>`;
                    let h4=`<h2 style="text-align:center;">כתובת מדויקת: ${preciseAddress}</h2> <br>`;
                    let h5=`<h2 style="text-align:center;">קישור לכתובת המדויקת שבה נסרק הברקוד במפות גוגל: ${googleMapsUrl}</h2> <br>`;
                    let embad = `<iframe src="${preciseAddress}"></iframe>`
                    let body = h1+h2+h3+h4+h5+embad;
                    sendEmail(ownerEmail, subject, body);
                    

                });
            }, function(error) {
                alert("לא הצלחנו לאתר את מיקומך: " + error.message);
            });
        } else {
            alert("הדפדפן שלך אינו תומך באיתור מיקום.");
        }
    }
    notifyBtnModal.addEventListener('click', function() {
        handleNotifyClick();
        modal.style.display = 'none';
    });

    notifyBtnPage.addEventListener('click', handleNotifyClick);
});


const RenderDetails=()=>{
    $('#findH2Modal').html(`מצאת את ${ProfileData.petName} !`);
    let profilephoto =ProfileData.profileLink.split(`\\`)[ProfileData.profileLink.split(`\\`).length-1];
    let coverphoto =ProfileData.coverLink.split(`\\`)[ProfileData.coverLink.split(`\\`).length-1];
    $('#cover-image').css('background-image', `url(${prefixPhoto+coverphoto})`);
    $('#profile-image').css('background-image', `url(${prefixPhoto+profilephoto})`);

    $('#petNameTitle').html('שם: '+ProfileData.petName);
    $('#pettypelabel').html('סוג: '+ProfileData.petType);
    ProfileData.petGender=='female'?$('#petAgelabel').html('בת: '+ProfileData.petAge+' שנים'):$('#petAgelabel').html('בן: '+ProfileData.petAge+' שנים');
    $('#kalevet').html(`חיסון כלבת : ${ProfileData.vaccineRabies?'✅':'❌'}`);
    $('#meshushe').html(`חיסון משושה : ${ProfileData.vaccineDistemper?'✅':'❌'}`);
    $('#park').html(`חיסון לתולעת הפארק : ${ProfileData.dewormed?'✅':'❌'}`);
    $('#sirus').html(` סירוס : ${ProfileData.neutered?'✅':'❌'}`);

    $('#ownerName').html('שם : '+ProfileData.ownerName);
    $('#ownerMail').html(ProfileData.ownerEmail);
    $('#ownerPhone').html(ProfileData.ownerPhone);
    let phone = ProfileData.ownerPhone.slice(1);
    phone = `+972${phone}`;

    $('#ownerPhone').attr('href', `tel:${phone}`);
    $('#ownerMail').attr('href', `mailto:${ProfileData.ownerEmail}`);





}



function sendEmail(to,subject,body) {
    
    Email.send({
        SecureToken:'9512cd3e-b42e-4791-8bb0-7294b2bc2dfb',
  
        To: to,
        From: "gilad.meirson@gmail.com",
        Subject: subject,
        Body:body,
    }).then(
        message =>
        swal.fire({
            title: 'הודעה נשלחה!',
            text: 'הודעה נשלחה בהצלחה לבעלים.',
            icon: 'success',
            confirmButtonText: 'אישור'
        })
        

    );
}







async function getPreciseAddress(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const address = data.address;

        let addressParts = [];
        if (address.road) addressParts.push(address.road);
        if (address.house_number) addressParts.push(address.house_number);
        if (address.neighbourhood) addressParts.push(address.neighbourhood);
        if (address.suburb) addressParts.push(address.suburb);
        if (address.city || address.town || address.village) {
            addressParts.push(address.city || address.town || address.village);
        }
        if (address.state) addressParts.push(address.state);
        if (address.country) addressParts.push(address.country);

        // מחברים את כל חלקי הכתובת לכתובת אחת מלאה
        const preciseAddress = addressParts.join(', ');

        return preciseAddress;
    } catch (error) {
        console.error('שגיאה בקבלת הכתובת:', error);
        return `לא הצלחנו לקבל כתובת מדויקת. קווי רוחב: ${lat}, קווי אורך: ${lon}`;
    }
}

