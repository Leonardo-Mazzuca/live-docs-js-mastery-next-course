import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  


const UserTypeSelector = ({userType,setUserType,onClickHandler}:UserTypeSelectorParams) => {
  
    const accessChangeHandler =(type:UserType) => {
        setUserType(type)
        onClickHandler && onClickHandler(type)
    }
  
 return (
    <Select onValueChange={(type:UserType)=>accessChangeHandler(type)} value={userType}>
    <SelectTrigger className="shad-select">
        <SelectValue placeholder="Theme" />
    </SelectTrigger>
    <SelectContent className="border-none bg-dark-200">
        <SelectItem className="shad-select-item" value="viewer">can view</SelectItem>
        <SelectItem className="shad-select-item" value="editor">can edit</SelectItem>
    </SelectContent>
</Select>

  )

}

export default UserTypeSelector