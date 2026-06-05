// Reusable component for adding clickable item names
export default function ClickableItemText({children}){

    return <span className='cooking-clickable-item' data-name={children}>{children}</span>

}