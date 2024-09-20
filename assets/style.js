$(document).ready(function() {
    function handleFileUpload(inputId, wrapperId, previewId) {
        const $input = $(`#${inputId}`);
        const $wrapper = $(`#${wrapperId}`);
        const $preview = $(`#${previewId}`);
        const $success = $wrapper.find('.file-upload-success');

        $wrapper.on('click', function(e) {
            if (e.target !== $input[0]) {
                e.preventDefault();
                $input.click();
            }
        });

        $input.on('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                $wrapper.addClass('file-selected');
                $success.fadeIn().delay(2000).fadeOut();
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    $preview.attr('src', e.target.result).fadeIn();
                }
                reader.readAsDataURL(file);
            } else {
                $wrapper.removeClass('file-selected');
                $preview.fadeOut();
            }
        });
    }

    handleFileUpload('pet-profile-pic', 'profile-pic-wrapper', 'profile-pic-preview');
    handleFileUpload('pet-cover-pic', 'cover-pic-wrapper', 'cover-pic-preview');
});