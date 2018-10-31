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

var KisBpmParticipantsSelectPopupCtrl = [ '$scope', '$http', function($scope, $http) {
    if ($scope.this.list === undefined || $scope.this.list === null) {
        $scope.this.list = [];
    }
    $scope.data = {
        treeData: [],
        treeConfig: {
            idAttribute: 'nodeId',
            labelAttribute: 'nodeName',
            expandToDepth: 1
        },
        initSelectedData: [],
        selectedData: [],
        selectedList: [],
        queryName: '',
        selectedCache: []
    };
    $scope.data.initSelectedData = angular.copy($scope.this.list);
    $scope.data.selectedData =  angular.copy($scope.this.list);
    $scope.data.treeData = loadTreeData($scope);

    $scope.selectNode = function(ivhNode, ivhIsSelected, ivhTree) {
        $scope.data.selectedData = getSelectedTree(ivhTree);
    };

    $scope.toggleNode = function(ivhNode, ivhIsExpanded, ivhTree) {
        if ((!ivhIsExpanded && ivhNode.children.length) ||
            (ivhNode.nodeType === 'USER') || ivhNode.clicked) {
            return false;
        }
        // 组织人员
        if (ivhNode.nodeType === 'ORG') {
            getUsersByNodeId(KISBPM.URL.getOrgUsers(ivhNode.nodeId), ivhNode, ivhTree, $scope);
        }
        // 角色人员
        if (ivhNode.nodeType === 'ROLE') {
            getUsersByNodeId(KISBPM.URL.getRoleUsers(ivhNode.nodeId), ivhNode, ivhTree, $scope);
        }
    };

    $scope.close = function() {
        $scope.data.selectedCache = $scope.data.initSelectedData
        $scope.$emit('$showAddSelectPop', {
            isShow: false,
            selectedData: $scope.data.selectedCache
        });
        $scope.$hide();
    };

    $scope.save = function() {
        $scope.data.selectedCache = $scope.data.selectedData
        $scope.$emit('$showAddSelectPop', {
            isShow: false,
            selectedData: $scope.data.selectedCache
        });
        $scope.$hide();
    };

    // 接口异步请求，第一次加载的节点显示有问题，导致第一次点击展开有问题
    function loadTreeData($scope) {
        var resultData = [{
            nodeId: 'org',
            nodeName: '组织',
            children: []
        }, {
            nodeId: 'role',
            nodeName: '角色',
            children: []
        }];
        Promise.all([
            $http.get(KISBPM.URL.getOrgTree()),
            $http.get(KISBPM.URL.getRoleTree())
        ]).then((data) => {
            $scope.$apply(function() {
            resultData[0].children = data[0].data;
            resultData[1].children = data[1].data;
            setSelectedTree($scope, resultData);
            });
        }).catch(error => {
            console.log('load tree error:' + error);
        })
        return resultData;
    }

    function getSelectedTree(data) {
        var selectedData = [];
        for (let i=0, len = data.length; i<len; i++) {
            if(data[i].selected) {
                selectedData.push({
                  nodeId: data[i].nodeId, nodeType: data[i].nodeType, nodeName: data[i].nodeName
                }); // data[i]
            }
            if (data[i].children) {
                selectedData = selectedData.concat(getSelectedTree(data[i].children));
            }
        }
        return selectedData;
    }

    function setSelectedTree($scope, treeData) {
        for (let i=0, len=$scope.data.selectedData.length; i<len; i++) {
            $scope.data.treeData = changeTreeStatus($scope.data.selectedData[i], treeData);
        }
    }

    function changeTreeStatus(selectedData, treeData) {
        for (let i=0, len = treeData.length; i<len; i++) {
            if(selectedData.nodeId === treeData[i].nodeId &&
                selectedData.nodeType === treeData[i].nodeType
            ) {
                treeData[i]['selected'] = true;
            }
            if (treeData[i].children) {
                treeData[i].children = changeTreeStatus(selectedData, treeData[i].children);
            }
        }
        return treeData;
    }

    function getUsersByNodeId(url, ivhNode, ivhTree, $scope) {
        return $http.get(url).then(function(data) {
            ivhNode.children = convertChildren(ivhNode, data);
            ivhNode.clicked = true;
        }).then(() => {
            if (ivhNode.children.length) {
                // ivhIsExpanded = true;
                ivhNode.__ivhTreeviewExpanded = true;
            }
            setSelectedTree($scope, ivhTree);
        }).catch(function(error) {
            console.log('error!' + error);
        })
    }

    function convertChildren(ivhNode, data) {
        ivhNode.children = ivhNode.children ? ivhNode.children : [];
        // 排除添加相同用户
        for (let i=0, len=data.data.length; i<len; i++) {
            let findIndex = ivhNode.children.findIndex((item) => {
                return item.nodeId === data.data[i].nodeId;
            })
            if (findIndex >= 0) {
                data.data.splice(findIndex, 1);
            }
        }
        return ivhNode.children.concat(data.data)
    }

}];
