

function Dropdown ({ selectedOption, handleChange, manhwa }) {


    return (
        <div className="w-3/4">
            <label htmlFor="myDropdown" className="mb-2 text-sm font-medium">
               Select Chapter
            </label>
            <select
                id="myDropdown"
                value={selectedOption} // Controlled component
                onChange={handleChange} // Handle change event
                className="block w-full p-2 border border-gray-300 rounded-md text-black"
            >
                <option className="text-black"  value="">-- Choose Chapter --</option>
                {
                    manhwa.chapters?.map((chp,i) => {

                        return (
                            <option key={i + (i+1)*23} value={i}>
                               {chp.read && 
                                    <img alt="check?" src={process.env.PUBLIC_URL + '/images/check.png'}></img>}
                                    {chp.chapter}
                            </option>
                        )
                    })
                }
            </select>
        </div>
    )
};

export default Dropdown;