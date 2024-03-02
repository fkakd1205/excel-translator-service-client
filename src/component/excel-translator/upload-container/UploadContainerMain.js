import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';
import ExcelTranslatorCommonModal from "../../modal/CommonModal";
import { useLocation } from "react-router-dom";
import UploadContainerBody from "./UploadContainerBody";
import CreateUploadHeaderModal from "./modal/CreateUploadHeaderModal";

class UploadHeaderDetail {
    constructor() {
        this.id = uuidv4();
        this.cellNumber = -1;
        this.headerName = '';
        this.cellType = '';
    }

    toJSON() {
        return {
            id: this.id,
            cellNumber: this.cellNumber,
            headerName: this.headerName,
            cellType: this.cellType
        }
    }
}

export default function UploadContainerMain(props) {
    const location = useLocation()
    const query = queryString.parse(location.search);

    const [createHeaderModalOpen, setCreateHeaderModalOpen] = useState(false);
    
    const [selectedHeader, setSelectedHeader] = useState(null);
    const [headerDetails, setHeaderDetails] = useState([]);

    useEffect(() => {
        function initHeaderTitleState() {
            let headerId = query.headerId;
            let headers = props.excelTranslatorHeaderList.find(r => r.id === headerId);
            setSelectedHeader(headers)
        }
        
        if (!props.excelTranslatorHeaderList) {
            return;
        }

        if(!query.headerId) {
            setSelectedHeader(null);
            return;
        }

        initHeaderTitleState();
    }, [query.headerId, props.excelTranslatorHeaderList]);

    const onCreateHeaderModalOpen = () => {
        if (!selectedHeader) {
            alert('헤더 형식을 먼저 선택해주세요.');
            return;
        }

        let data = []
        // 이미 등록된 헤더 양식이 있는 경우
        if(selectedHeader.uploadHeaderDetail.details.length > 0) {
            data = [...selectedHeader.uploadHeaderDetail.details]
        }else {     // 새로운 양식을 만들 경우
            data = [new UploadHeaderDetail().toJSON()]
        }

        setHeaderDetails(data);
        setCreateHeaderModalOpen(true);
    }

    const onCreateHeaderModalClose = () => {
        setCreateHeaderModalOpen(false);
    }

    const handleUpdateUploadHeader = async (e) => {
        e.preventDefault();

        if(selectedHeader.downloadHeaderDetail.details.length > 0) {
            if(!window.confirm('업로드 양식을 변경하면 다운로드 양식은 초기화됩니다. 그래도 수정하시겠습니까?')) {
                return
            }
        }
             
        // 헤더 순서 설정
        let uploadDetails = headerDetails.map((r, idx) => {
            let data = {
                ...r,
                cellNumber: idx,
                headerName: r.headerName,
                cellType: r.cellType
            };

            return data;
        });
        await props.handleUpdateUploadForm(uploadDetails);
        onCreateHeaderModalClose();
    }

    const onChangeDetailInputValue = (e, detailId) => {
        e.preventDefault();

        let data = headerDetails.map(r => {
            if (r.id === detailId) {
                return {
                    ...r,
                    [e.target.name]: e.target.value
                }
            } else {
                return {
                    ...r
                }
            }
        });

        setHeaderDetails(data)
    }

    const handleRemoveCell = (e, headerId) => {
        e.preventDefault();

        let data = headerDetails.filter(r => r.id !== headerId);
        setHeaderDetails(data)
    }

    const handleAddCell = (e) => {
        e.preventDefault();

        let data = [new UploadHeaderDetail().toJSON()]
        setHeaderDetails([...headerDetails, ...data])
    }

    const handleMoveCellUp = (e, detailId) => {
        e.preventDefault();

        let targetIdx = -1;

        headerDetails.forEach((detail, idx) => {
            if (detail.id === detailId) {
                targetIdx = idx;
                return;
            }
        });

        handleChangeArrayControl(targetIdx, parseInt(targetIdx) - 1);
    }

    const handleMoveCellDown = (e, detailId) => {
        e.preventDefault();

        let targetIdx = -1;

        headerDetails.forEach((detail, idx) => {
            if (detail.id === detailId) {
                targetIdx = idx;
                return;
            }
        });

        handleChangeArrayControl(targetIdx, parseInt(targetIdx) + 1);
    }

    const handleChangeArrayControl = (targetIdx, moveValue) => {
        if (!(headerDetails.length > 1)) return;

        let newPosition = parseInt(moveValue);
        if (newPosition < 0 || newPosition >= headerDetails.length) return;

        let data = headerDetails;
        let target = data.splice(targetIdx, 1)[0];
        data.splice(newPosition, 0, target);

        setHeaderDetails([...data])
    }

    const handleDownloadForm = async () => {
        await props.handleDownloadForUploadForm();
    }

    return (
        <>
            <UploadContainerBody
                uploadedExcelData={props.uploadedExcelData}
                selectedHeader={selectedHeader}

                onCreateHeaderModalOpen={onCreateHeaderModalOpen}
                onCreateHeaderModalClose={onCreateHeaderModalClose}
                handleDownloadForm={handleDownloadForm}
            />

            {/* 업로드 엑셀 헤더 설정 모달창 */}
            <ExcelTranslatorCommonModal
                open={createHeaderModalOpen}
                onClose={() => onCreateHeaderModalClose()}
                maxWidth={'xs'}
                fullWidth={true}
            >
                <CreateUploadHeaderModal
                    headerDetails={headerDetails}

                    handleUpdateUploadHeader={handleUpdateUploadHeader}
                    onChangeDetailInputValue={onChangeDetailInputValue}
                    handleRemoveCell={handleRemoveCell}
                    handleAddCell={handleAddCell}
                    handleMoveCellUp={handleMoveCellUp}
                    handleMoveCellDown={handleMoveCellDown}
                ></CreateUploadHeaderModal>
            </ExcelTranslatorCommonModal>
        </>
    )
}
