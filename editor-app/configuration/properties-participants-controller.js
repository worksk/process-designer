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
        && $scope.property.value.participants !== undefined
        && $scope.property.value.participants !== null) 
    {
        $scope.participants = angular.copy($scope.property.value.participants);
    } else {
        $scope.participants = {};
    }

    // 参与者人员列表
    // if ($scope.participants.participantlist == undefined || $scope.participants.participantlist.length == 0) {
    // 	$scope.participants.participantlist = [
    //         {id: 'level21', name:'二级1', type:'业务角色'},
    //         {id: '1235', name:'业务角色-待办2', type:'业务角色2'}
    //     ];
    // }
    // 参与者名称
    if (!$scope.participants.participantName) {
        $scope.participants.participantName = '';
    }

    var unbind = $rootScope.$on('$showAddSelectPar', function(e, data){
        $scope.participants.showAdd = data.isShow;
        $scope.participants.participantlist = data.selectedData;
    });

    $scope.$on('$destroy', unbind);

    // 新增参与者
    $scope.addPar = function() {
        $scope.participants.showAdd = true;
    }

    $scope.deletePar = function(item) {
        $scope.participants.participantlist = $scope.participants.participantlist.filter((val) => {
            return val.id !== item.id;
        })
    }

    $scope.save = function() {
        $scope.property.value = {};
        filterName($scope);
        $scope.property.value.participants = $scope.participants;

        $scope.updatePropertyInModel($scope.property);
        $scope.close();
    };

    $scope.close = function() {
        filterName($scope);
        $scope.property.mode = 'read';
        $scope.$hide();
    };

    var filterName = function($scope) {
        $scope.participants.participantName = $scope.participants.participantlist.map((item) => {
            return item.name
        }).join(',');
    }

}];