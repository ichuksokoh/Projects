import { Account } from "./Account"
import Logo from '../assets/typingLogo2.png'


export const Dashboard = () => {


    return (
        <div className="flex pt-4 mx-auto max-h-[80px] min-w-[1000px] justify-between items-center self-stretch ">
            <div className="w-full h-full flex-col justify-start">
                <img src={Logo}  className=" h-full w-1/10"/>
            </div>
            <div>
                <Account/>
            </div>
        </div>
    )
}