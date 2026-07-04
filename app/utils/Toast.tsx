import { toast } from "sonner";


type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center" | "center";
type ToastTransition = "fadeIn" | "fadeOut" | "slideIn" | "slideOut";

type ToastProps = {
    message: string;
    duration: number;
    progress: boolean;
    position: ToastPosition;
    transition: ToastTransition;
    icon: string;
    sound: boolean,
}
export const Toast = {

}