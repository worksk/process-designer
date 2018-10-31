// 参与者弹窗
var KisBpmParticipantsCtrl = [ '$scope', '$modal', function($scope, $modal) {

    // Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/participants-popup.html?version=' + Date.now(),
        scope: $scope,
        backdrop: 'static'
    };

    // Open the dialog
    $modal(opts);
}];

var KisBpmParticipantsPopupCtrl = [ '$scope', '$rootScope', function($scope, $rootScope) {
    // 参与者对象
    if ($scope.property.value !== undefined && $scope.property.value !== null
        && $scope.property.value.list !== undefined
        && $scope.property.value.list !== null)
    {
        $scope.list = angular.copy($scope.property.value.list);
    } else {
        $scope.list = [];
    }

    // 参与者名称
    if (!$scope.name) {
        $scope.name = '';
    }

    var unbind = $rootScope.$on('$showAddSelectPop', function(e, data){
        $scope.showAddPop = data.isShow;
        $scope.list = data.selectedData;
    });

    $scope.$on('$destroy', unbind);

    // 新增参与者
    $scope.addPar = function() {
        $scope.showAddPop = true;
    }

    $scope.deletePar = function(item) {
        $scope.list = $scope.list.filter((val) => {
            return val.nodeId !== item.nodeId;
        })
    }

    $scope.save = function() {
        $scope.property.value = {};
        filterName($scope);
        $scope.property.value.list = $scope.list;
        $scope.property.value.name = $scope.name;

        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    $scope.close = function() {
        filterName($scope);
        $scope.property.mode = 'read';
        $scope.$hide();
    };

    var filterName = function($scope) {
        $scope.name = $scope.list.map((item) => {
            return item.nodeName
        }).join(',');
    }

}];
