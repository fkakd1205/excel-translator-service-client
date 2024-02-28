import { useState, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';
import CreateDownloadHeaderModal from "./modal/CreateDownloadHeaderModal";
import ExcelTranslatorCommonModal from "../../modal/CommonModal";
import DownloadContainerBody from "./DownloadContainerBody";
import { useLocation } from "react-router-dom";

class DownloadHeaderDetail {
    constructor() {
        this.id = uuidv4();
        this.headerName = '';
        this.targetCellNumber = -1;
        this.fixedValue = '';
        this.uploadHeaderId = null;
    }

    toJSON() {
        return {
            id: this.id,
            headerName: this.headerName,
            targetCellNumber: this.targetCellNumber,
            fixedValue: this.fixedValue,
            uploadHeaderId: this.uploadheaderId
        }
    }
}

export default function DownloadContainerMain(props) {
    const location = useLocation();
    const query = queryString.parse(location.search)

    const [createHeaderModalOpen, setCreateHeaderModalOpen] = useState(false);
    const [fixedValueCheckList, setFixedValueCheckList] = useState([]);

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
        } else if (!(selectedHeader.uploadHeaderDetail.details.length > 0)) {
            alert('업로드 엑셀 양식을 먼저 설정해주세요.');
            return;
        }

        setFixedValueCheckList(selectedHeader.downloadHeaderDetail.details.map(r => {
            if (r.targetCellNumber === -1) {
                return r.id;
            }
        }));

        let data = []
        if (selectedHeader.downloadHeaderDetail.details.length > 0) {

            data = [...selectedHeader?.downloadHeaderDetail.details]
        }else {
            data = [new DownloadHeaderDetail().toJSON()]
        }

        setHeaderDetails(data);
        setCreateHeaderModalOpen(true);
    }

    const onCreateHeaderModalClose = () => {
        setCreateHeaderModalOpen(false);
    }

    const handleAddCell = (e) => {
        e.preventDefault();

        let data = [new DownloadHeaderDetail().toJSON()]
        setHeaderDetails([...headerDetails, ...data])
    }

    const handleRemoveCell = (e, headerId) => {
        e.preventDefault();

        if(headerDetails.length > 1) {
            let data = headerDetails.filter(r=> r.id !== headerId);
            setHeaderDetails(data)
        }else{
            alert('삭제할 수 없습니다.');
        }
    }

    const handleUpdateDownloadHeader = async (e) => {
        e.preventDefault();

        await props.handleUpdateDownloadForm(headerDetails);
        onCreateHeaderModalClose();
    }

    const onChangeSelectedHeaderField = (e, downloadHeaderId) => {
        e.preventDefault();

        let newDetails = headerDetails.map(r => {
            if(r.id === downloadHeaderId){
                let uploadHeaderId = selectedHeader?.uploadHeaderDetail.details.filter(r => r.cellNumber === e.target.value)[0].id;

                return {
                    ...r,
                    targetCellNumber : parseInt(e.target.value),
                    uploadHeaderId : uploadHeaderId
                }
            }else{
                return {
                    ...r
                }
            }
        });

        setHeaderDetails(newDetails)
    }

    const handleIsChecked = (downloadHeaderId) => {
        return fixedValueCheckList.includes(downloadHeaderId);
    }

    const handleCheckOne = (e, downloadHeaderId) => {
        let checkList = []
        let newDetails = []

        if (e.target.checked) {
            checkList = fixedValueCheckList.concat(downloadHeaderId)

            // 체크하면 targetCellNumber을 -1으로 변경
            newDetails = headerDetails.map(r=>{
                if(r.id === downloadHeaderId){
                    return {
                        ...r,
                        targetCellNumber: parseInt(-1)
                    }
                }else{
                    return {
                        ...r
                    }
                }
            });

            setHeaderDetails(newDetails)
        } else {
            checkList = fixedValueCheckList.filter(r => r !== downloadHeaderId);

            // 체크 해제하면 fixedValue를 빈 값으로 변경
            newDetails = headerDetails.map(r => {
                if(r.id === downloadHeaderId){
                    return {
                        ...r,
                        fixedValue: "",
                        targetCellNumber: parseInt(-1)
                    }
                }else{
                    return {
                        ...r
                    }
                }
            });

        }
        
        setFixedValueCheckList(checkList)
        setHeaderDetails(newDetails)
    }

    const onChangeHeaderFieldValue = (e, downloadHeaderId) => {
        e.preventDefault();

        let newDetails = headerDetails?.map(r => {
            if(r.id === downloadHeaderId){
                return {
                    ...r,
                    [e.target.name] : e.target.value
                }
            }else{
                return {
                    ...r
                }
            }
        });

        setHeaderDetails(newDetails)
    }

    return (
        <>
            <DownloadContainerBody
                createHeaderModalOpen={createHeaderModalOpen}
                selectedHeader={selectedHeader}

                onCreateHeaderModalOpen={onCreateHeaderModalOpen}
            />

            {/* Create Download Header Modal */}
            <ExcelTranslatorCommonModal
                open={createHeaderModalOpen}
                onClose={() => onCreateHeaderModalClose()}
                maxWidth={'md'}
                fullWidth={true}
            >
                <CreateDownloadHeaderModal
                    selectedHeader={selectedHeader}
                    headerDetails={headerDetails}

                    handleUpdateDownloadHeader={handleUpdateDownloadHeader}
                    handleAddCell={handleAddCell}
                    handleRemoveCell={handleRemoveCell}
                    onChangeSelectedHeaderField={onChangeSelectedHeaderField}
                    handleIsChecked={handleIsChecked}
                    handleCheckOne={handleCheckOne}
                    onChangeHeaderFieldValue={onChangeHeaderFieldValue}
                ></CreateDownloadHeaderModal>
            </ExcelTranslatorCommonModal>
        </>
    )
}
