import type { Manxa } from "@/types";
import type { JSX } from "react";
import { Card, CardTitle } from "./ui/card";

type Props = {
    manxa: Manxa;
};

// simple card UI to display manxa cover and title
export default function ManxaCard({ manxa }: Props): JSX.Element {


    return (
        <Card className="max-w-40 max-h-72 pt-0 pb-3 border-0 hover:animate-pulse gap-3 [@media(max-width:900px)]:max-w-32 [@media(max-width:900px)]:max-h-60">
            <div className="h-72 overflow-hidden">
                <img className="rounded-t-lg h-full w-full object-cover" src={"http://52.59.130.106/api/imageProxy.php?url=" + encodeURIComponent(manxa.img)} alt="" />
            </div>
            <CardTitle className="font-normal text-sm pl-1 mb-0 pb-0 h-5">
                <p className="max-w-40 [@media(max-width:900px)]:max-w-30 font-medium overflow-hidden text-ellipsis whitespace-nowrap">{manxa.title}</p>
            </CardTitle>
        </Card>
    );
}