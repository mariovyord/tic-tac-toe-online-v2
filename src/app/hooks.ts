import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

// use instead of plain hooks beacouse of types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;