import { Response, Request } from "express";
import z, { success } from "zod";
import { startProbe, OnvifDevice } from "node-onvif-ts";

export const getCamNetwork = (req: Request, res: Response) => {
  console.log("start the discovery proses");
  startProbe()
    .then((deviceInfoList) => {
      console.log(deviceInfoList);
      console.log(deviceInfoList.length + "device were found");
      deviceInfoList.forEach((info) => {
        console.log("- " + info.urn);
        console.log("  - " + info.name);
        console.log("  - " + info.xaddrs[0]);
      });

      return res.status(200).json({
        success: true,
        message: "success get data",
        data: deviceInfoList,
      });
    })
    .catch((error) => {
      return res.status(404).json({
        success: false,
        message: "cannot found comments",
        error: error,
      });
    });
};
