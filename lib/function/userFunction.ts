import { loginType } from "@/type/loginType";
import { registerType } from "@/type/registerType";
import { userGetType } from "@/type/userGetType";
import { useEffect, useState } from "react";
import { getUser, login, register } from "./api";
import { setToken } from "./token";

export const CreateUser = async (data: registerType) => {
    try{
        const res = await register(data);
        if(res.status === 201){
            return 'berhasil membuat user'
        }
        if(res.status === 400){
            return 'User sudah terdaftar, ganti username dan email'
        }
    }catch(e){
        return e;
    }
}

export const loginUser = async (data: loginType) => {
    try{
        const res = await login(data);
        if(res.status === 200){
            await setToken(res.data.token.toString());
            return true
        }
        if(res.status === 400){
            return 'Username atau password salah'
        }
    }catch(e: any){
        alert(`ERROR FULL: ${e}`);
        alert(`ERROR RESPONSE: ${e?.response}`);
        alert(`ERROR MESSAGE: ${e?.message}`);
        alert(e?.message);
        throw e;
    }
}

export const GetDataUser = () => {
    const [dataUser, setDataUser] = useState<userGetType[]>([])

    useEffect(()=>{
        const fetch = async() => {
            const res = await getUser();
            if(res.status === 200){
                setDataUser(res.data);
            }
        }
        fetch();
    },[])

    useEffect(()=>{
        // alert(`dataUser: ${JSON.stringify(dataUser)}`)
    },[])
    
    return { dataUser }
}