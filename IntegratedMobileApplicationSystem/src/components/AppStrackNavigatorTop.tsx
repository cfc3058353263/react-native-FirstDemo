import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import AppContainer from './AppStrackNavigatorBottom';
import CreatePlan from './createPlan/createPlan';
import EngineeringArchives from './engineerings/EngineeringArchives';
import PatrolRecord from "./patrolRecord/patrolrecord";
import Detail from "./patrolRecord/detail";
import PatrolRecordInformation from "./patrolRecord/PatrolRecordInformation";
import InspectionIncident from "./patrolRecord/InspectionIncident";
import InitiatingEvents from "./Initiatingevents/InitiatingEvents";
import EventList from "./eventList/EventList";
import EventListDetail from "./eventList/Detail";
import DutyList from "./dutyList/DutyList";
import DutyDetail from "./dutyList/DutyDetail";
import Commonmenu from "./commonmenu/commonmenu";
import Search from "./main/search";
import Notice from "./notice/notice";
import MyInfo from "./myInfo/myInfo";
import ModifyInfo from "./myInfo/modifyInfo";
import MyInfodetails from "./myInfo/myInfodetails";
import NoticeDetail from "./notice/noticeDetail";
import Stationinfo from "./stationinfo/stationinfo";
import StationinfoDetail from "./stationinfo/stationinfoDetail";
import Waterinformation from "./waterinformation/waterinformation";
import Hydrologicalmonitor from "./hydrologicalmonitor/hydrologicalmonitor";
import Workconditioninfo from "./workconditioninfo/workconditioninfo";
import Waterhistory from "./waterhistory/waterhistory";
import WaterinformationDetail from "./waterinformation/waterinformationDetail";
import Facilitiesdetail from "./facilitiesdetail/facilitiesdetail";
import Facilityhistory from "./facilityhistory/facilityhistory";
import Monitorindex from "./facilitiesdetail/monitorindex";
import Contingencyplan from "./contingencyplan/contingencyplan";
import ContingencyplanDetail from "./contingencyplan/contingencyplanDetail";
import Watermap from "./watermap/watermap";
import RealtimeRelease from "./realtimeRelease/realtimeRelease";
import Personnelmap from "./personnelmap/personnelmap";
import Projectdetails from "./projectdetails/projectdetails";
import ProjectReal from "./projectdetails/projectReal";
import Projecthistoryinfo from "./projecthistoryinfo/projecthistoryinfo";
import Engineermap from "./engineermap/engineermap";
import Maintenanceplan from "./maintenanceplan/maintenanceplan";
import PlanReview from "./maintenanceplan/planReview";
import DispatchingInstruction from "./dispatchingInstruction/dispatchingInstruction";
import DispatchingDetail from "./dispatchingInstruction/dispatchingDetail";
import DispatchingLogDetail from "./dispatchingInstruction/dispatchingLogDetail";
import TieDetail from "./workingOprationInfo/TieDetail";
import AMap3d from "../utils/components/Amap3d";
import ModuleCamera from "../utils/components/ModuleCamera";
import ModuleQRCode from "../utils/components/ModuleQRCode";
import Login from "../components/login/Login";
import Waterregime from "./waterregime/waterregime";
import Waterregimemap from "./workconditionmap/waterregimemap";
import HydrologicalInformation from "./hydrologicalInformation/hydrologicalInformation";
import Videocall from "./videocall/videocall"
import MaintainHistory from "./waterregime/maintainHistory"
/**
 * 顶部状态栏
 * @author zkxS
 */
const AppStrackNavigator = (isLogin) => createStackNavigator({
    index: {
        screen: AppContainer,
    },
    login: {
        screen: Login,
        navigationOptions: {
            header: null
        }
    },
    initiatingEvents: {
        screen: InitiatingEvents,
        navigationOptions: {
            headerTitle: "发起事件",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            },
        },
    },
    eventList: {
        screen: EventList,
        navigationOptions: {
            headerTitle: "事件列表",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    eventListDetail: {
        screen: EventListDetail,
        navigationOptions: {
            headerTitle: "事件详情",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    dutyList: {
        screen: DutyList,
        navigationOptions: {
            headerTitle: "值班列表",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    dutyDetail: {
        screen: DutyDetail,
        navigationOptions: {
            headerTitle: "值班详情",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    commonmenu: {
        screen: Commonmenu,
    },
    stationinfo: {
        screen: Stationinfo,
        navigationOptions: {
            headerTitle: "测站信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    stationinfoDetail: {
        screen: StationinfoDetail,
        navigationOptions: {
            headerTitle: "测站信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    notice: {
        screen: Notice,
        navigationOptions: {
            headerTitle: "通知消息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    noticeDetail: {
        screen: NoticeDetail,
        navigationOptions: {
            headerTitle: "消息详情",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    waterinformation: {
        screen: Waterinformation,
        navigationOptions: {
            headerTitle: "监测信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    waterinformationDetail: {
        screen: WaterinformationDetail,
        navigationOptions: {
            headerTitle: "监测详情",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    waterhistory: {
        screen: Waterhistory,
        navigationOptions: {
            headerTitle: "历史信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    facilitiesdetail: {
        screen: Facilitiesdetail,
        navigationOptions: {
            headerTitle: "设施详情",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    hydrologicalmonitor: {
        screen: Hydrologicalmonitor,
        navigationOptions: {
            headerTitle: "监测信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    workconditioninfo: {
        screen: Workconditioninfo,
        navigationOptions: {
            headerTitle: "基础信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    contingencyplan: {
        screen: Contingencyplan,
        navigationOptions: {
            headerTitle: "应急预案",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    contingencyplanDetail: {
        screen: ContingencyplanDetail,
        navigationOptions: {
            headerTitle: "预案详情",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    monitorindex: {
        screen: Monitorindex,
        navigationOptions: {
            headerTitle: "监测指标",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    waterregimemap: {
        screen: Waterregimemap,
        navigationOptions: {
            headerTitle: "工况地图",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    watermap: {
        screen: Watermap,
        navigationOptions: {
            headerTitle: "水质地图",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    personnelmap: {
        screen: Personnelmap,
        navigationOptions: {
            headerTitle: "人员地图",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    dispatchingInstruction: {
        screen: DispatchingInstruction,
        navigationOptions: {
            headerTitle: "调度指令管理",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    dispatchingDetail: {
        screen: DispatchingDetail,
        navigationOptions: {
            headerTitle: "指令详情",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    dispatchingLogDetail: {
        screen: DispatchingLogDetail,
        navigationOptions: {
            headerTitle: "日志详情",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    projectdetails: {
        screen: Projectdetails,
        navigationOptions: {
            headerTitle: "实时信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    projectReal: {
        screen: ProjectReal,
        navigationOptions: {
            headerTitle: "实时信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    engineermap: {
        screen: Engineermap,
        navigationOptions: {
            headerTitle: "工程安全地图",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    projecthistoryinfo: {
        screen: Projecthistoryinfo,
        navigationOptions: {
            headerTitle: "历史信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    tieDetail: {
        screen: TieDetail,
        navigationOptions: {
            headerTitle: "详细",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    aMap3d: {
        screen: AMap3d,
        navigationOptions: {
            headerTitle: "地图",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    createPlan: {
        screen: CreatePlan,
        navigationOptions: {
            headerTitle: "创建计划",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    maintenanceplan: {
        screen: Maintenanceplan,
        navigationOptions: {
            headerTitle: "计划审核",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    planReview: {
        screen: PlanReview,
        navigationOptions: {
            headerTitle: "上报审批",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        },
    },
    engineeringArchives: {
        screen: EngineeringArchives,
        navigationOptions: {
            headerTitle: "档案管理",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    patrolRecord: {
        screen: PatrolRecord,
        navigationOptions: {
            headerTitle: "巡检记录",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    patrolRecordDetail: {
        screen: Detail,
        navigationOptions: {
            headerTitle: "巡检记录详情",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    QrCode: {
        screen: ModuleQRCode,
        navigationOptions: {
            headerTitle: "二维码扫描",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    camera: {
        screen: ModuleCamera,
        navigationOptions: {
            headerTitle: "拍照",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    PatrolRecordInformation: {
        screen: PatrolRecordInformation,
        navigationOptions: {
            headerTitle: "巡检记录信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    myInfo: {
        screen: MyInfo,
        navigationOptions: {
            headerTitle:"个人信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    myInfodetails: {
        screen: MyInfodetails,
        navigationOptions: {
            headerTitle: "修改密码",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    search: {
        screen: Search,
        navigationOptions: {
            headerTitle: "搜索",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    //新增指令暂存
    realtimeRelease: {
        screen: RealtimeRelease,
        navigationOptions: {
            headerTitle: "新增指令",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    facilityhistory: {
        screen: Facilityhistory,
        navigationOptions: {
            headerTitle: "历史信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    waterregime: {
        screen: Waterregime,
        navigationOptions: {
            headerTitle: "水情实时信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    hydrologicalInformation: {
        screen: HydrologicalInformation,
        navigationOptions: {
            headerTitle: "水情信息查询",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    modifyInfo: {
        screen: ModifyInfo,
        navigationOptions: {
            headerTitle: "修改信息",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    inspectionIncident: {
        screen: InspectionIncident,
        navigationOptions: {
            headerTitle: "发起事件",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    maintainHistory: {
        screen: MaintainHistory,
        navigationOptions: {
            headerTitle: "详细",
            headerTintColor: "#fff",
            headerStyle: {
                backgroundColor: "#2a5696",
            }
        }
    },
    videocall: {
        screen: Videocall,
        navigationOptions:{
            header: null
        }
    },
}, {
    initialRouteName: isLogin,
    headerLayoutPreset: "center",
    headerMode: "screen"
})
const AppStrackNavigatorTop = (isLogin) => createAppContainer(AppStrackNavigator(isLogin));
export default AppStrackNavigatorTop;
