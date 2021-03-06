/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */
var KISBPM = KISBPM || {};

KISBPM.URL = {

    getModel: function(modelId) {
        return ACTIVITI.CONFIG.contextRoot + '/service/model/' + modelId + '/json';
    },

    getStencilSet: function() {
        // return ACTIVITI.CONFIG.contextRoot + '/editor/stencilset?version=' + Date.now();
        return 'stencilset.json?version=' + Date.now();
    },

    putModel: function(modelId) {
        return ACTIVITI.CONFIG.contextRoot + '/service/model/' + modelId + '/save';
    },

    getOrgTree: function() {
        return ACTIVITI.CONFIG.contextRoot + '/api/workflow/participant/orgtree';
    },

    getOrgUsers: function(orgId) {
        return ACTIVITI.CONFIG.contextRoot + '/api/workflow/participant/orgusers?orgId=' + orgId;
    },

    getRoleTree: function() {
        return ACTIVITI.CONFIG.contextRoot + '/api/workflow/participant/roletree';
    },

    getRoleUsers: function(roleId) {
        return ACTIVITI.CONFIG.contextRoot + '/api/workflow/participant/roleusers?roleId=' + roleId;
    }
};