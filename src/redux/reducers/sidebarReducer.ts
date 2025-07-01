import { SideBarActionType } from "../actions/sidebarAction";

export interface SidebarState {
  isSidebarOpen: boolean;
}

const initialState: SidebarState = {
  isSidebarOpen: false,
};

const reducer = (state = initialState, action: SideBarActionType): SidebarState => {
  switch (action) {
    case SideBarActionType.OPEN_SIDEBAR:
      return {
        isSidebarOpen: true,
      };
    case SideBarActionType.CLOSE_SIDEBAR:
      return {
        isSidebarOpen: false,
      };
    case SideBarActionType.TOGGLE_SIDEBAR:
      return {
        isSidebarOpen: !state.isSidebarOpen,
      };
    default:
      return state;
  }
};

export default reducer;
