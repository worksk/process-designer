// 选择参与者
var KisBpmParticipantsSelectCtrl = [ '$scope', '$modal', function($scope, $modal) {

    // Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/participants-select-popup.html?version=' + Date.now(),
        scope: $scope,
        backdrop: 'static'
    };

    // Open the dialog
    $modal(opts);
}];

var KisBpmParticipantsSelectPopupCtrl = [ '$scope', '$rootScope', function($scope, $rootScope) {
    $scope.data = {treeData: [], initSelectedData: [], selectedData: [], queryName: '', selectedCache: []};

    $scope.data.initSelectedData = angular.copy($scope.this.participants.participantlist);
    $scope.data.selectedData =  angular.copy($scope.this.participants.participantlist);
    $scope.data.treeData = loadTreeData($scope);

    $scope.selectNode = function(ivhNode, ivhIsSelected, ivhTree) {
        // if (ivhIsSelected) {
        //     $scope.data.selectedData.push(ivhNode);
        // } else {
        //     $scope.data.selectedData = deleteArr($scope.data.selectedData, ivhNode)
        // } 
        $scope.data.selectedData = getSelectedTree(ivhTree);
    };

    $scope.close = function() {
        $scope.data.selectedCache = $scope.data.initSelectedData
        $scope.$emit('$showAddSelectPar', {
            isShow: false,
            selectedData: $scope.data.selectedCache
        });
        $scope.$hide();
    };

    $scope.save = function() {
        $scope.data.selectedCache = $scope.data.selectedData
        $scope.$emit('$showAddSelectPar', {
            isShow: false,
            selectedData: $scope.data.selectedCache
        });
        $scope.$hide();
    };

    function loadTreeData($scope) {
        var data = [{
            name: '一级',
            id: 'level1',
            children: [{
                name: '二级1',
                id: 'level21',
                children: [{
                    name: '三级1',
                    id: 'level31'
                }, {
                    name: '三级2',
                    id: 'level32',
                }]
            },{
                name: '二级2',
                id: 'level22'
            }]
        }];

        setSelectedTree($scope, data);

        return data;
    }

    function getSelectedTree(data) {
        var selectedData = [];
        for (let i=0, len = data.length; i<len; i++) {
            if(data[i].selected) {
                selectedData.push(data[i]);
            }
            if (data[i].children) {
                selectedData = selectedData.concat(getSelectedTree(data[i].children));
            }
        }
        return selectedData;
    }

    function setSelectedTree($scope, treeData) {
        for (let i=0, len=$scope.data.selectedData.length; i<len; i++) {
            $scope.data.treeData = changeTreeStatus($scope.data.selectedData[i].id, treeData);
        }
    }

    function changeTreeStatus(selectedId, treeData) {
        for (let i=0, len = treeData.length; i<len; i++) {
            if(selectedId === treeData[i].id) {
                treeData[i]['selected'] = true;
            }
            if (treeData[i].children) {
                treeData[i].children = changeTreeStatus(selectedId, treeData[i].children);
            }
        }
        return treeData;
    }

    function deleteArr(arr, item) {
        let deleteIndex = -1;
        for (let i=0, len=arr.length; i<len ; i++) {
            if (arr[i].id === item.id) {
                deleteIndex = i;
            }
        }
        if (deleteIndex > -1) {
            arr.splice(deleteIndex, 1);
        }
        return arr;
    }

}];