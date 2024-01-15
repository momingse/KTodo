import { composeWithDevTools } from "@redux-devtools/extension";
import {
  combineReducers,
  createStore,
  applyMiddleware,
  AnyAction,
  Store,
} from "redux";
import thunk, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import app from "@/redux/reducers/appReducer";
import todo from "@/redux/reducers/todoReducer";
import todoEditor from "@/redux/reducers/todoEditorReducer";
import { createWrapper } from "next-redux-wrapper";

const rootReducer = combineReducers({
  app,
  todo,
  todoEditor,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);

const makeStore = () => store;
export const wrapper = createWrapper<Store<ReduxState>>(makeStore, {
  debug: true,
});

export type AppDispatch = typeof store.dispatch;
export type ReduxState = ReturnType<typeof rootReducer>;
export type TypedDispatch = ThunkDispatch<ReduxState, any, AnyAction>;
export type TypedThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  AnyAction
>;
export const useTypedDispatch = () => useDispatch<TypedDispatch>();
export const useTypedSelector: TypedUseSelectorHook<ReduxState> = useSelector;
export default store;

