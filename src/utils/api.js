// const baseDataApi = '/api/proGather/list';
// const getFuncAddressApi = '/api/func/getAddress';
const baseDataApi = '/v1/interfaceproject/proGather/list';
const getFuncAddressApi = '/v1/interfacefunc/getAddress';

// const findProApi = '/api/project/find';
// const addProApi = '/api/project/add';
// const editProApi = '/api/project/edit';
// const delProApi = '/api/project/del';
const findProApi = '/v1/interfaceproject/find';
const addProApi = '/v1/interfaceproject/add';
const editProApi = '/v1/interfaceproject/edit';
const delProApi = '/v1/interfaceproject/del';

// const findReportApi = '/api/report/find';
// const delReportApi = '/api/report/del';
const findReportApi = '/v1/interfacereport/find';
const delReportApi = '/v1/interfacereport/del';

// const findModuleApi = '/api/module/find';
// const addModuleApi = '/api/module/add';
// const delModuleApi = '/api/module/del';
// const stickModuleApi = '/api/module/stick';

const findModuleApi = '/v1/interfacemodule/find';
const addModuleApi = '/v1/interfacemodule/add';
const editModuleApi = '/v1/interfacemodule/edit';
const delModuleApi = '/v1/interfacemodule/del';
const stickModuleApi = '/v1/interfacemodule/stick';

// const findConfigApi = '/api/config/find';
// const addConfigApi = '/api/config/add';
// const editConfigApi = '/api/config/edit';
// const delConfigApi = '/api/config/del';
const findConfigApi = '/v1/interfaceconfig/find';
const addConfigApi = '/v1/interfaceconfig/add';
const editConfigApi = '/v1/interfaceconfig/edit';
const delConfigApi = '/v1/interfaceconfig/del';

const loginApi = '/api/login';
const logoutApi = '/api/logout';
const registerApi = '/api/register';
const changePasswordApi = '/api/changePassword';

// const findApiApi = '/api/apiMsg/find';
// const delApiApi = '/api/apiMsg/del';
// const runApiApi = '/api/apiMsg/run';
// const addApiApi = '/api/apiMsg/add';
// const editAndCopyApiApi = '/api/apiMsg/editAndCopy';

const findApiApi = '/v1/interfaceapimsg/find';
const delApiApi = '/v1/interfaceapimsg/del';
const runApiApi = '/v1/interfaceapimsg/run';
const addApiApi = '/v1/interfaceapimsg/add';
const editAndCopyApiApi = '/v1/interfaceapimsg/editAndCopy';




// const findCaseSetApi = '/api/caseSet/find';
// const delCaseSetApi = '/api/caseSet/del';
// const addCaseSetApi = '/api/caseSet/add';
// const stickCaseSetApi = '/api/caseSet/stick';


const findCaseSetApi = '/v1/interfacecaseset/find';
const delCaseSetApi = '/v1/interfacecaseset/del';
const addCaseSetApi = '/v1/interfacecaseset/add';
const stickCaseSetApi = '/v1/interfacecaseset/stick';


// const startTaskApi = '/api/task/start';
// const pauseTaskApi = '/api/task/pause';
// const resumeTaskApi = '/api/task/resume';
// const removeTaskApi = '/api/task/remove';
// const runTaskApi = '/api/task/run';
// const delTaskApi = '/api/task/del';
// const editTaskApi = '/api/task/edit';
// const addTaskApi = '/api/task/add';
// const findTaskApi = '/api/task/find';


const startTaskApi = '/v1/interfacetask/start';
const pauseTaskApi = '/v1/interfacetask/pause';
const resumeTaskApi = '/v1/interfacetask/resume';
const removeTaskApi = '/v1/interfacetask/remove';
const runTaskApi = '/v1/interfacetask/run';
const delTaskApi = '/v1/interfacetask/del';
const editTaskApi = '/v1/interfacetask/edit';
const addTaskApi = '/v1/interfacetask/add';
const findTaskApi = '/v1/interfacetask/find';

// const findCaseApi = '/api/case/find';
// const delCaseApi = '/api/case/del';
// const runCaseApi = '/api/report/run';
// // const editCaseApi = '/api/case/edit';
// const addCaseApi = '/api/case/add';
// const configDataApi = '/api/config/data';


const runCaseApi = '/v1/interfacereport/run';



const findCaseApi = '/v1/interfacecase/find';
const delCaseApi = '/v1/interfacecase/del';
const editCaseApi = '/v1/interfacecase/edit';
const addCaseApi = '/v1/interfacecase/add';
const configDataApi = 'v1/interfacecase/config/data';




// const fileUploadingApi = '/api/upload';
// const checkFileApi = '/api/checkFile';
// const importApiApi = '/api/apiMsg/fileChange';
const fileUploadingApi = '/v1/interfaceapimsg/upload';
const checkFileApi = '/v1/interfaceapimsg/checkFile';
const importApiApi = '/v1/interfaceapimsg/fileChange';



// const findFuncApi = '/api/func/find';
// const createFuncApi = '/api/func/create';
// const checkFuncApi = '/api/func/check';
// const saveFuncApi = '/api/func/save';
const findFuncApi = '/v1/interfacefunc/find';
const createFuncApi = '/v1/interfacefunc/create';
const checkFuncApi = '/v1/interfacefunc/check';
const saveFuncApi = '/v1/interfacefunc/save';



const findUserApi = '/api/user/find';
const editUserApi = '/api/user/edit';
const delUserApi = '/api/user/del';
const changeStatusUserApi = '/api/user/changeStatus';
const baseUrl = process.env.BASE_URL

const delcasedatacase = '/v1/interfacecase/apiCase/del'
const downlaodreport = '/v1/interfacereport/download'

export default {
    baseDataApi,
    getFuncAddressApi,
    checkFileApi,

    findUserApi,
    editUserApi,
    delUserApi,
    changeStatusUserApi,

    findReportApi,
    delReportApi,

    findFuncApi,
    createFuncApi,
    checkFuncApi,
    saveFuncApi,

    startTaskApi,
    pauseTaskApi,
    resumeTaskApi,
    removeTaskApi,
    runTaskApi,
    delTaskApi,
    editTaskApi,
    addTaskApi,
    findTaskApi,

    findCaseApi,
    delCaseApi,
    runCaseApi,
    editCaseApi,
    addCaseApi,
    configDataApi,

    findCaseSetApi,
    delCaseSetApi,
    addCaseSetApi,
    stickCaseSetApi,

    findProApi,
    addProApi,
    editProApi,
    delProApi,

    findModuleApi,
    addModuleApi,
    editModuleApi,
    delModuleApi,
    stickModuleApi,

    findConfigApi,
    addConfigApi,
    editConfigApi,
    delConfigApi,

    loginApi,
    logoutApi,
    registerApi,
    changePasswordApi,

    findApiApi,
    delApiApi,
    runApiApi,
    addApiApi,
    editAndCopyApiApi,

    fileUploadingApi,
    importApiApi,
	baseUrl,
	delcasedatacase,
	downlaodreport,
}