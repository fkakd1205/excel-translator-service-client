import axios from "axios";

const excelTranslatorDataConnect = () => {
    return {
        searchList: async function () {
            return await axios.get(`api/v1/excel-translator/list`, {
                withCredentials: true
            })
        },
        postOne: async function (headerTitle) {
            return await axios.post(`/api/v1/excel-translator/one`, headerTitle, {
                withCredentials: true
            })
        },
        putOne: async function (headerTitle) {
            return await axios.put(`api/v1/excel-translator/one`, headerTitle, {
                withCredentials: true
            })
        },
        deleteOne: async function (headerId) {
            return await axios.delete(`api/v1/excel-translator/one`, {
                params: {
                    headerId: headerId
                },
                withCredentials: true
            })
        },
        postFile: async function (formData) {
            return await axios.post(`/api/v1/excel-translator/upload`, formData, {
                headers: {
                    "content-types": "multipart/form-data"
                },
                withCredentials: true
            })
        },
        createUploadHeaderDetail: async function (uploadHeaderDetail) {
            return await axios.put(`/api/v1/excel-translator/header/upload/one`, uploadHeaderDetail, {
                withCredentials: true
            })
        },
        createDownloadHeaderDetails: async function (downloadHeaderDetail) {
            return await axios.put(`/api/v1/excel-translator/header/download/one`, downloadHeaderDetail, {
                withCredentials: true
            })
        },
        downloadTranslatedExcelFile: async function (uploadedExcelData) {
            return await axios.post(`/api/v1/excel-translator/download`, uploadedExcelData, {
                responseType: 'blob',
                withCredentials:true
            })
        },
    }
}

export {
     excelTranslatorDataConnect
};