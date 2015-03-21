/* character-selection-dialog.js
 * Represents the dialog for the characters from which the user can choose one
 */
(function (global) {
    'use strict';

    var dialogHtml = '<div class="modal fade" id="playerSelectionModal">'+
                        '<div class="modal-dialog">'+
                            '<div class="modal-content">'+
                                '<div class="modal-header">'+
                                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
                                    '<h4 class="modal-title">Please select your character</h4>'+
                                '</div>'+
                                '<div class="modal-body">'+
                                '</div>'+
                                '<div class="modal-footer">'+
                                    '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                      '</div>';

    var characters = [];
    var selectedCharacter = '';
    var onClose = [];

    function onResourceClick(event) {
        characters.forEach(function (character) {
            $(character).removeClass('image-selected');
        });
        $(event.currentTarget).addClass('image-selected');
        selectedCharacter = event.currentTarget;
    }

    // Loads all player characters to the dialog
    function initializeAllPlayerCharacters() {
        var playerResources = global.AppResources.player;
        for (var playerResource in playerResources) {
            if (playerResources.hasOwnProperty(playerResource)) {
                var resource = global.Resources.get(playerResources[playerResource]);
                characters.push(resource);
                resource.onclick = onResourceClick;
                $('.modal-body').append(resource);
            }
        }
        selectedCharacter = characters[0];
        $(selectedCharacter).addClass('image-selected');
    }

    // Initializes and shows the modal
    function open() {
        $(document.body).append(dialogHtml);

        initializeAllPlayerCharacters();

        var $playerSelectionModal = $('#playerSelectionModal');
        $playerSelectionModal.on('hidden.bs.modal', function () {
            onClose.forEach(function (onCloseHandler) {
                onCloseHandler();
            });
        });

        $playerSelectionModal.modal('show');
    }

    // Returns the last selected character
    function getSelectedCharacter() {
        return selectedCharacter;
    }

    global.CharacterSelectionDialog = {
        getSelectedPlayer: getSelectedCharacter,
        open: open,
        onClose: onClose
    };

})(window);