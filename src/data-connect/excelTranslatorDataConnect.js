import axios from "axios";

const excelTranslatorDataConnect = () => {
    return {
        searchAll: async function () {
            return await axios.get(`api/v1/excel-translator/all`, {
                withCredentials: true
            })
        },
        createOne: async function (headerTitle) {
            return await axios.post(`/api/v1/excel-translator/one`, headerTitle, {
                withCredentials: true
            })
        },
        changeOne: async function (headerTitle) {
            return await axios.put(`api/v1/excel-translator/one`, headerTitle, {
                withCredentials: true
            })
        },
        deleteOne: async function (headerId) {
            return await axios.delete(`api/v1/excel-translator/one/${headerId}`, {
                params: {
                    headerId: headerId
                },
                withCredentials: true
            })
        },
        uploadFile: async function (formData) {
            return await axios.post(`/api/v1/excel-translator/upload`, formData, {
                headers: {
                    "content-types": "multipart/form-data"
                },
                withCredentials: true
            })
        },
        updateUploadHeaderDetail: async function (headerId, uploadedDetails) {
            return await axios.put(`/api/v1/excel-translator/header/upload-form/one/${headerId}`, uploadedDetails, {
                withCredentials: true
            })
        },
        updateDownloadHeaderDetails: async function (headerId, downloadHeaderDetail) {
            return await axios.put(`/api/v1/excel-translator/header/download-form/one/${headerId}`, downloadHeaderDetail, {
                withCredentials: true
            })
        },
        downloadTranslatedExcelFile: async function (headerId, uploadedExcelData) {
            return await axios.post(`/api/v1/excel-translator/download/${headerId}`, uploadedExcelData, {
                responseType: 'blob',
                withCredentials: true
            })
        },
        downloadUploadedHeaderDetails: async function (headerId) {
            return await axios.get(`api/v1/excel-translator/header/upload-form/download/${headerId}`, {
                responseType: 'blob',
                withCredentials: true
            })
        }
    }
}

export {
     excelTranslatorDataConnect
};