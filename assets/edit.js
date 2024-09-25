ProfileData = null;
const photosAPI = `https://proj.ruppin.ac.il/cgroup41/test2/tar1/api/Upload/uploadImages`;
const prefixPhoto=`https://proj.ruppin.ac.il/cgroup41/test2/tar1/uploadedFiles/`;
const updateAPI=`https://proj.ruppin.ac.il/cgroup41/test2/tar1/api/Profiles/UpdateProfile`;
$(document).ready(()=>{
    $('.loader-overlay').hide();
    ProfileData = JSON.parse(sessionStorage.getItem('profileData'));
    console.log(ProfileData);
 
    renderDetails();

    $('#mainForm').submit((e)=>{
        $('.loader-overlay').show();
        e.preventDefault();
        //console.log("Form Submitted");
        const urllocs = ProfileData.urlId;
        const oWnerName = $('#owner-name').val();
        const oWnerEmail = $('#owner-email').val();
        const oWnerPhone = $('#owner-phone').val();
        const pass = $('#passwordIN').val();

        const petType = $('#pet-type').val();
        const petName = $('#pet-name').val();
        const petAge = $('#pet-age').val();
        const petGender = $('#pet-gender').val();

        //kalevet
        const vaccineRabies = $('#vaccine-rabies').is(':checked');
        //meshushe
        const vaccineDistemper = $('#vaccine-distemper').is(':checked');
        //tolat hapark
        const dewormed = $('#dewormed').is(':checked');
        //mesuras
        const neutered = $('#neutered').is(':checked');


        const petProfilePic = $('#pet-profile-pic')[0].files[0];
        const petCoverPic = $('#pet-cover-pic')[0].files[0];
    
        const formData = new FormData();
        formData.append('files', petProfilePic);
        formData.append('files', petCoverPic);
        formData.append('profilePicName', 'profile'+urllocs);
        formData.append('coverPicName', 'cover'+urllocs);

        const client = {
            id: ProfileData.id,
            urlId: ProfileData.urlId,
            ownerName:oWnerName,
            ownerEmail:oWnerEmail,
            ownerPhone:oWnerPhone,
            petType:petType,
            petName:petName,
            petAge:petAge,
            petGender:petGender,
            vaccineRabies:vaccineRabies,
            vaccineDistemper:vaccineDistemper,
            dewormed:dewormed,
            neutered:neutered,
            password:pass,
        }

        $.ajax({
            url: photosAPI,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: (data)=>{
                console.log(data);
                client.profileLink = data[0];
                client.coverLink = data[1];
                //console.log(client);
                $.ajax({
                    url: updateAPI,
                    type: 'POST',
                    data: JSON.stringify(client),
                    contentType: 'application/json',
                    success: (data)=>{
                        console.log(data);
                        $('.loader-overlay').hide();
                        Swal.fire({
                            title: "יש! הצלחנו לעדכן את הפרטים שלכם",
                            text: "הפרטים שלכם נשמרו בהצלחה, מיד תועברו לדף הפרופיל שלכם",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(()=>{
                            sessionStorage.setItem('profileData', JSON.stringify(client));
                            window.location.href = "show.html";
                        });
                    },
                    error: (err)=>{
                        console.error(err);
                        Swal.fire({
                            title: "אופס..",
                            text: "התרחשה תקלה בעת עדכון נתונים, אנא נסו שוב.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                });

            },
            error: (err)=>{
                console.error(err);
                Swal.fire({
                    title: "אופס..",
                    text: "התרחשה תקלה בעת עדכון נתונים, אנא נסו שוב.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        });








    });

})





const renderDetails=()=>{
    
    $('#owner-name').val(ProfileData.ownerName);
    $('#owner-phone').val(ProfileData.ownerPhone);
    $('#owner-email').val(ProfileData.ownerEmail);
    $('#pet-type').val(ProfileData.petType);
    $('#pet-gender').val(ProfileData.petGender);
    $('#pet-name').val(ProfileData.petName);
    $('#pet-age').val(ProfileData.petAge);

    $('#vaccine-rabies').prop('checked',ProfileData.vaccineRabies);
    $('#vaccine-distemper').prop('checked',ProfileData.vaccineDistemper);
    $('#dewormed').prop('checked',ProfileData.dewormed);
    $('#neutered').prop('checked',ProfileData.neutered);

    let profilephoto =ProfileData.profileLink.split(`\\`)[ProfileData.profileLink.split(`\\`).length-1];
    let coverphoto =ProfileData.coverLink.split(`\\`)[ProfileData.coverLink.split(`\\`).length-1];

    $('#profile-pic-preview').attr('src',`${prefixPhoto}${profilephoto}`);
    $('#cover-pic-preview').attr('src',`${prefixPhoto}${coverphoto}`);
    $('.file-preview').show();

}