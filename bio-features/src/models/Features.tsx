export interface Feature{
    sid: Sid;
    displayName: string;
    epKeywords: string[];
    categorySid: Sid

}



export interface Sid{
    id: number
}