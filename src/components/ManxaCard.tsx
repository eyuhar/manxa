import type { Manxa } from "@/types";
import type { JSX } from "react";
import { Card, CardTitle } from "./ui/card";

type Props = {
    manxa: Manxa;
};

export default function ManxaCard({ manxa }: Props): JSX.Element {


    return (
        <Card className="w-50 pt-0 border-0 hover:animate-pulse gap-3 [@media(max-width:900px)]:max-w-32 [@media(max-width:900px)]:max-h-60">
            <div className="h-72 overflow-hidden">
                <img className="rounded-t-lg h-full w-full object-cover" src={"http://52.59.130.106/api/imageProxy.php?url=" + encodeURIComponent(manxa.img)} alt="" />
            </div>
            <CardTitle className="font-normal text-sm pl-1 mb-0 pb-0 h-5">
                <p className="w-50 [@media(max-width:900px)]:max-w-30 overflow-hidden text-ellipsis whitespace-nowrap">{manxa.title}</p>
            </CardTitle>
        </Card>
    );
}