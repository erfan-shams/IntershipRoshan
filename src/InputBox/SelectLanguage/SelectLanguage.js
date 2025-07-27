import { useEffect } from 'react';
import './SelectLanguage.css'
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../../redux/actions/languageActions';

function SelectLanguage() {
   
    const currentLanguage = useSelector((state) => state.language.currentLanguage);
    const dispatch = useDispatch();

    const handleLanguageToggle = () => {
        
        if (currentLanguage === 'en') {
          dispatch(setLanguage('fa'));
        } else {
          dispatch(setLanguage('en'));
        }
      };

      useEffect(() => {
           console.log(currentLanguage)
      },[currentLanguage])


    return <div className='language_dropdown' style={{ position: 'absolute', top: "80%", left: "17%" }}>

        <div class="dropdown-container">
            <select class="custom-dropdown" onChange={handleLanguageToggle}>
                <option value="english">انگلیسی</option>
                <option value="farsi" selected>فارسی</option>
            </select>
            <span class="dropdown-arrow"></span>
        </div>
        <div style={{fontFamily:'IRANYekan',fontStyle:'normal',color:'#626262',fontSize:'20px',textAlign:'right',fontWeight:'300',marginLeft:"10px"}}>:زبان گفتار</div>
        


    </div>
}

export default SelectLanguage









