'use strict';

angular.module('bahmni.common.offline')
    .service('offlineAddressHierarchyDao', ['$http', '$q', function ($http, $q) {
        var db;

        var init = function (_db) {
            db = _db;
        };

        var insertAddressHierarchy = function (addressHierarchy) {
            return insertAddressHierarchyLevel(addressHierarchy.addressHierarchyLevel).then(function () {
                return insertAddressHierarchyEntry(addressHierarchy);
            })
        };

        var insertAddressHierarchyEntry = function (entry) {
            var addressHierarchyEntryTable = db.getSchema().table('address_hierarchy_entry');
            return getAddressHierarchyEntry(entry.uuid).then(function (existingEntry) {
                var row = addressHierarchyEntryTable.createRow({
                    name: entry.name,
                    level_id: entry.level.levelId,
                    parent_id: entry.parent,
                    user_generated_id: entry.userGeneratedId,
                    uuid: entry.uuid,
                    _id: existingEntry ? existingEntry._id : undefined
                });

                return db.insertOrReplace().into(addressHierarchyEntryTable).values([row]).exec().then(function () {
                    return entry;
                });
            });
        };

        var insertAddressHierarchyLevel = function (level) {
            var addressHierarchyLevelTable = db.getSchema().table('address_hierarchy_level');
            return getAddressHierarchyLevel(level.uuid).then(function (existingLevel) {
                var row = addressHierarchyLevelTable.createRow({
                    address_hierarchy_level_id: level.levelId,
                    name: level.name,
                    parent_level_id: level.parent,
                    address_field: level.addressField,
                    uuid: level.uuid,
                    required: level.required,
                    _id: existingLevel ? existingLevel._id : undefined
                });

                return db.insertOrReplace().into(addressHierarchyLevelTable).values([row]).exec().then(function () {
                    return level;
                });
            });
        };

        var getAddressHierarchyLevel = function (levelUuid) {
            var addressHierarchyLevelTable = db.getSchema().table('address_hierarchy_level');
            return db.select()
                .from(addressHierarchyLevelTable)
                .where(addressHierarchyLevelTable.uuid.eq(levelUuid)).exec()
                .then(function (result) {
                    return result != undefined ? result[0] : undefined;
                });
        };

        var getAddressHierarchyEntry = function (entryUuid) {
            var addressHierarchyEntryTable = db.getSchema().table('address_hierarchy_entry');
            return db.select()
                .from(addressHierarchyEntryTable)
                .where(addressHierarchyEntryTable.uuid.eq(entryUuid)).exec()
                .then(function (result) {
                    return result != undefined ? result[0] : undefined;
                });
        };

        return {
            init: init,
            insertAddressHierarchy: insertAddressHierarchy
        }
    }]);