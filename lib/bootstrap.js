import angular from 'angular';

import 'angular-resource';
import 'angular-bootstrap';
import 'bootstrap/css/bootstrap.css!';
import 'angular-bootstrap-lightbox';
import _ from 'lodash';

import 'font-awesome';
import 'font-awesome/css/font-awesome.css!';

angular.module('app', [
  'ui.bootstrap',
  'ngResource',
  'bootstrapLightbox'
])

.config(function (LightboxProvider, $sceProvider) {
  $sceProvider.enabled(false);

  LightboxProvider.templateUrl = 'custom.html';

  LightboxProvider.getImageUrl = function (image) {
    return `data:${image.type};base64,${image.data}`;
  };

  LightboxProvider.getImageCaption = function (image) {
    return image.caption;
  };
})

.controller('GalleryCtrl', ($scope, Lightbox, Attachment) => {
  Attachment.info.query().$promise.then((data) => {
    $scope.attachments = _.map(data, (attachment) => {
      let iconMap = {
        'application/pdf': 'file-pdf-o',
        'application/ms-word': 'file-word-o',
        'image/jpeg': 'file-image-o'
      };
      return {
        caption: attachment.description,
        icon: iconMap[attachment.type],
        type: attachment.type
      };
    });
  });

  $scope.openLightboxModal = (index) => {
    Attachment.download.get({id: index}).$promise.then((data) => {
      $scope.attachments[index]['data'] = data.data;
      Lightbox.openModal($scope.attachments, index);
    });
  };
}).factory('Attachment', ($resource) => {
  return {
    info: $resource('http://localhost:3000/attachments/:id'),
    download: $resource('http://localhost:3000/download/:id')
  };
})

.controller('LightboxCtrl', function ($scope, $window, Attachment, Lightbox, $sce) {
  $scope.download = (file) => {
    $window.open(file);
  };
});

export function bootstrap() {
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });
}
