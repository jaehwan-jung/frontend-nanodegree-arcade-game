/* restart-dialog.js
 * This class represents the dialog that prompts user to restart the game
 * This is displayed when the user dies.
 */
(function (global) {
    'use strict';

    var dialogHtml =
        '<div class="modal fade" id="restartModal"> ' +
            '<div class="modal-dialog"> ' +
                '<div class="modal-content"> ' +
                    '<div class="modal-header"> ' +
                        '<h4 class="modal-title">You are dead. Click the button to restart</h4> ' +
                    '</div> ' +
                    '<div class="modal-body"> ' +
                        '<button type="button" class="btn btn-default" data-dismiss="modal" onClick="window.location.reload();">Restart</button> ' +
                    '</div> ' +
                '</div> ' +
            '</div> ' +
        '</div>';

    // Opens the dialog
    function open() {
        $(global.document.body).append(dialogHtml);
        $('#restartModal').modal('show');
    }

    global.RestartDialog = {
        open: open
    };

})(this);