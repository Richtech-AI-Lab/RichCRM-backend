const TagService = require('../db/tag/tag.service');
const Types = require('../db/types');
const { v4: uuidv4 } = require('uuid');

class TagController {

    constructor() {
        this.readTagByLabel = this.readTagByLabel.bind(this);
        this.createTag = this.createTag.bind(this);
        this.readAllTags = this.readAllTags.bind(this);
        this.readTagsByType = this.readTagsByType.bind(this);
        this.updateTag = this.updateTag.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
        this.procTags = this.procTags.bind(this);
    }

    async readTagByLabel(req, res) {
        const {label} = req.body;
        try {
            const tag = await TagService.readTagByLabel(label);
            if (tag !== null) {
                const tagObj = this.procTag(tag);
                res.status(200).json({
                    status: "success",
                    data: [tagObj],
                    message: "[TagController][readTag]: Tag retrieved successfully"
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TagController][readTag]: Tag not found"
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TagController][readTag] Internal server error: ${error}`
            });
        }
    }

    async readAllTags(req, res) {
        try {
            const tags = await TagService.readAllTags();
            if (tags !== null) {
                const tagList = this.procTags(tags);
                res.status(200).json({
                    status: "success",
                    data: tagList,
                    message: "[TagController][readAllTags]: Tags retrieved successfully"
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TagController][readAllTags]: Tags not found"
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TagController][readAllTags] Internal server error: ${error}`
            });
        }
    }

    async readTagsByType(req, res) {
        const {tagType} = req.body;
        
        try {

            const tagTypeEnum = Types.castIntToEnum(Types.tagType, tagType);
            if (tagTypeEnum === undefined) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TagController][readTagsByType]: Invalid tag type"
                });
            }

            const tags = await TagService.readTagByType(tagType);
            if (tags !== null) {
                const tagList = this.procTags(tags);
                res.status(200).json({
                    status: "success",
                    data: tagList,
                    message: "[TagController][readTagsByType]: Tag retrieved successfully"
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TagController][readTagsByType]: Tag not found"
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TagController][readTagsByType] Internal server error: ${error}`
            });
        }
    }

    async createTag(req, res) {
        const {label, color1, color2, tagType} = req.body;
        try {
            const existingTag = await TagService.readTagByLabel(label);
            if (existingTag !== null) {
                const tagObj = this.procTag(existingTag);
                res.status(400).json({
                    status: "success",
                    data: [tagObj],
                    message: "[TagController][createTag]: Tag already exists"
                });
            }
            if (color1 === undefined) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TagController][createTag]: Color1 is required"
                });
            }

            const tagObj = {
                label: label,
                tagType: tagType
            };

            if (/^#[0-9A-F]{6}$/i.test(color1) === false) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TagController][createTag]: Invalid color1"
                });
            }
            tagObj.color1 = color1;

            if (color2 !== undefined && color2 !== null) {
                if (/^#[0-9A-F]{6}$/i.test(color2) === false) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TagController][createTag]: Invalid color2"
                    });
                }
                tagObj.color2 = color2;
            }       

            if (tagType !== undefined) {
                const tagTypeEnum = Types.castIntToEnum(Types.tagType, tagType);
                if (tagTypeEnum === undefined) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TagController][createTag]: Invalid tag type"
                    });
                }
            } else {
                tagObj.tagType = Types.tagType.OTHER;
            }
                
            
            const data = await TagService.createTag(tagObj);
            if (data !== null) {
                res.status(200).json({
                    status: "success",
                    data: [tagObj],
                    message: "[TagController][createTag] Tag created successfully"
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TagController][createTag] Tag creation failed"
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TagController][createTag] Internal server error: ${error}`
            });
        }
    }

    async updateTag(req, res) {
        const {label, color1, color2, tagType} = req.body;
        try {
            const tag = await TagService.readTagByLabel(label);
            if (tag === null) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TagController][updateTag]: Tag not found"
                });
            }

            const tagObj = this.procTag(tag);

            if (tagType !== undefined && tagType !== null && tagType !== tagObj.tagType) {
                const tagTypeEnum = Types.castIntToEnum(Types.tagType, tagType);
                if (tagTypeEnum === undefined) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TagController][updateTag]: Invalid tag type"
                    });
                }
                tagObj.tagType = tagType;
            }

            if (label !== undefined && label !== null && label !== tagObj.label) {
                tagObj.label = label;
            }

            if (color1 !== undefined && color1 !== null && color1 !== "" && color1 !== tagObj.color1) {
                if (/^#[0-9A-F]{6}$/i.test(color1) === false) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TagController][updateTag]: Invalid color1"
                    });
                }
                tagObj.color1 = color1;
            }

            if (color2 !== undefined && color2 !== null && color2 !== "" && color2 !== tagObj.color2) {
                if (/^#[0-9A-F]{6}$/i.test(color2) === false) {
                    res.status(400).json({
                        status: "failed",
                        data: [],
                        message: "[TagController][updateTag]: Invalid color2"
                    });
                }
                tagObj.color2 = color2;
            }

            const data = await TagService.updateTag(tagObj);
            if (data !== null) {
                res.status(200).json({
                    status: "success",
                    data: [tagObj],
                    message: "[TagController][updateTag]: Tag updated successfully"
                });
            } else {
                console.log(tagObj);
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TagController][updateTag] Tag update failed"
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TagController][updateTag] Internal server error: ${error}`
            });
        }
    }

    async deleteTag(req, res) {
        const {label} = req.body;
        try {
            const tag = await TagService.readTagByLabel(label);
            if (tag === null) {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TagController][deleteTag]: Tag not found"
                });
            }

            const tagObj = this.procTag(tag);
            const data = await TagService.deleteTag(tagObj.label);
            if (data !== null) {
                res.status(200).json({
                    status: "success",
                    data: [tagObj],
                    message: "[TagController][deleteTag]: Tag deleted successfully"
                });
            } else {
                res.status(400).json({
                    status: "failed",
                    data: [],
                    message: "[TagController][deleteTag]: Tag deletion failed"
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failed",
                data: [],
                message: `[TagController][deleteTag] Internal server error: ${error}`
            });
        }
    }
        
    
    // Static functions
    procTag(tag) {
        return {
            "label": tag.Label,
            "color1": tag.Color1,
            "color2": tag.Color2,
            "tagType": tag.TagType,
        };
    }

    procTags(tags) {
        return tags.map(tag => this.procTag(tag));
    }
}

module.exports = new TagController();