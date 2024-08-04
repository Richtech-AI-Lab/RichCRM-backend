const TemplateService = require('../db/template/template.service');


class TemplateController {
    async readTemplateByTitle(req, res) {
        const { templateTitle } = req.body;
        try {
            const template = await TemplateService.getTemplateByTitle(templateTitle);
            if (template === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TemplateController][readTemplateByTitle] Template not found'
                });
            }
            return res.status(200).json({
                status: "success",
                data: [{
                    templateTitle: template.TemplateTitle,
                    templateContent: template.TemplateContent
                }],
                message: '[TemplateController][readTemplateByTitle] Template found'
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[TemplateController][readTemplateByTitle] Internal server error: ${error}`
            });
        }
    }

    async createTemplate(req, res) {
        const { templateTitle, templateContent } = req.body;
        try {
            // Check if the templateTitle is valid
            if (templateTitle === undefined) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TemplateController][createTemplate] Invalid templateTitle'
                });
            }

            // Check if the templateContent is valid
            if (templateContent === undefined) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TemplateController][createTemplate] Invalid templateContent'
                });
            }

            const template = await TemplateService.createTemplate({ templateTitle, templateContent });
            return res.status(200).json({
                status: "success",
                data: [{
                    templateTitle: template.TemplateTitle,
                    templateContent: template.TemplateContent
                }],
                message: '[TemplateController][createTemplate] Template created'
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[TemplateController][createTemplate] Internal server error: ${error}`
            });
        }
    }

    async updateTemplate(req, res) {
        const { templateTitle, templateContent } = req.body;
        try {
            // Check if the templateTitle is valid
            const template = await TemplateService.getTemplateByTitle(templateTitle);
            if (template === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TemplateController][updateTemplate] Template not found'
                });
            }

            // Check if the templateContent is valid
            if (templateContent === undefined) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TemplateController][updateTemplate] Invalid templateContent'
                });
            }

            const data = await TemplateService.updateTemplate({ templateTitle, templateContent });
            return res.status(200).json({
                status: "success",
                data: [{
                    templateTitle: data.TemplateTitle,
                    templateContent: data.TemplateContent
                }],
                message: '[TemplateController][updateTemplate] Template updated'
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[TemplateController][updateTemplate] Internal server error: ${error}`
            });
        }
    }

    async deleteTemplate(req, res) {
        const { templateTitle } = req.body;
        try {
            // Check if the templateTitle is valid
            const template = await TemplateService.getTemplateByTitle(templateTitle);
            if (template === null) {
                return res.status(400).json({
                    status: "failed",
                    data: [],
                    message: '[TemplateController][deleteTemplate] Template not found'
                });
            }

            const data = await TemplateService.deleteTemplate(templateTitle);
            return res.status(200).json({
                status: "success",
                data: [],
                message: '[TemplateController][deleteTemplate] Template deleted'
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                data: [],
                message: `[TemplateController][deleteTemplate] Internal server error: ${error}`
            });
        }
    }
}

module.exports = new TemplateController();