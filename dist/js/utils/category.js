"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelCategoryTags = exports.getCategoryValue = void 0;
function getCategoryValue(category) {
    if (!category)
        return undefined;
    return typeof category === "string" ? category : category.slug;
}
exports.getCategoryValue = getCategoryValue;
function getModelCategoryTags(model) {
    var _a;
    const c = model.categories || {};
    const typeVal = typeof c.type === "string" ? c.type : (_a = c.type) === null || _a === void 0 ? void 0 : _a.slug;
    return [c.tier1, c.tier2, c.tier3, typeVal, c.subtype].filter(Boolean);
}
exports.getModelCategoryTags = getModelCategoryTags;
