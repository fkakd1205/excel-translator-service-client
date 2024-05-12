import axios from "axios";

export default function testDataConnect() {
    return {
        uploadFile: async function (formData) {
            return await axios.post(`/api/v1/poi-test/upload`, formData, {
                withCredentials: true
            })
        },
        downloadExcelFile: async function (uploadedData) {
            return await axios.post(`/api/v1/poi-test/download`, uploadedData, {
                responseType: 'blob',
                withCredentials: true
            })
        }
    }
}