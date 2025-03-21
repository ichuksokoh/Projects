import { Account } from "./Account"


export const Dashboard = () => {


    return (
        <div className="flex pt-4 mx-auto max-h-[80px] min-w-[1000px] justify-between self-stretch ">
            <div>
                LOGO
            </div>
            <div>
                <Account/>
            </div>
        </div>
    )
}