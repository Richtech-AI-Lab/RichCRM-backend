const Tag = require('./tag.db');

class TagService {
    async readTag(tagId) {
        const data = await Tag.getTagById(tagId);

        if (data.Item !== undefined) {
            return data.Item;
        }

        return null;
    }

    async readTagByLabel(label) {
        const data = await Tag.getTagByLabel(label);

        if (data.Items !== undefined) {
            return data.Items;
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
        if (tag.tagId === undefined) {
            console.log("[TAG-Create] TagId is required");
            return null;
        }
        const data = await Tag.createTag(tag);
        return data;
    }

    async updateTag(tag) {
        if (tag.tagId === undefined) {
            console.log("[TAG-Update] TagId is required");
            return null;
        }
        const data = await Tag.updateTag(tag);

        return data;
    }

    async deleteTag(tagId) {
        if (tagId === undefined) {
            console.log("[TAG-Delete] TagId is required");
            return null;
        }
        const data = await Tag.deleteTag(tagId);

        return data;
    }
}

module.exports = new TagService();