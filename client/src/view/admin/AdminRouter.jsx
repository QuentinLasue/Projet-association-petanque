import { Route, Routes } from "react-router-dom";
import AddUser from "./AddUser";
import ListeMembres from "./ListeMembers";
import UpdateMember from "./UpdateMember";
import AddMember from "./AddMember";

function AdminRouter (){
    return (
        <Routes>
            <Route index path="/" element={<ListeMembres/>}/>
            <Route path="/nouvelUtilisateur" element={<AddUser/>} />
            <Route path="/modifier/:numero"  element={<UpdateMember/>}/>
            <Route path="/ajoutJoueur"  element={<AddMember/>}/>
        </Routes>
    );
};

export default AdminRouter;