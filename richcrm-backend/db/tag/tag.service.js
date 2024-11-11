const Tag = require('./tag.db');

class TagService {
    async readTagByLabel(label) {
        const data = await Tag.getTagByLabel(label);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async readTagByType(tagType) {
        const data = await Tag.getTagByType(tagType);

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async readAllTags() {
        const data = await Tag.getAllTags();

        if (data.Items !== undefined) {
            return data.Items;
        }

        return null;
    }

    async createTag(tag) {
        if (tag.label === undefined) {
            console.log("[TAG-Create] label is required");
            return null;
        }
        const data = await Tag.createTag(tag);
        return data;
    }

    async updateTag(tag) {
        if (tag.label === undefined) {
            console.log("[TAG-Update] label is required");
            return null;
        }
        const data = await Tag.updateTag(tag);

        return data;
    }

    async deleteTag(label) {
        if (label === undefined) {
            console.log("[TAG-Delete] label is required");
            return null;
        }
        const data = await Tag.deleteTag(label);

        return data;
    }
}

module.exports = new TagService();