import './Modal.css'
export default function Modal({active,setActive,children}){
    return(
        
        <div className={active?"modal active modal-content":"modal modal-content"} onClick={()=>{setActive(false)}}>
            <div className='modal__content' onClick={e=>e.stopPropagation()}>
            <div class="modal-body">
                    <div id="resolte-contaniner" style={{height:"500px;"}} class="overflow-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
} 

                
                
