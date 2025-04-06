import { Account } from "./Account"
import Logo from '../assets/typingLogo2.png'


export const Dashboard = () => {


    return (
        <div className="flex pt-4 mx-auto max-h-[80px] lg:min-w-[1000px] w-full justify-between items-center self-stretch ">
            <div className="w-full h-full flex-col justify-start">
                <img src={Logo}  className="h-full @min-xs:w-1/10"/>
            </div>
            <div>
                <Account/>
            </div>
        </div>
    )
}