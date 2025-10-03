import { Request, Response } from "express";
import { OnvifDevice } from "node-onvif-ts";
import z from "zod";
import { createOnvifSchema } from "../shcemas/onvif.schema";

// const ipRange = ["192.168.90.180", "192.168.90.190"]; // Define your custom IP range
const username = "admin"; // Camera's username
const password = "Artorius_2017"; // Camera's pa9ssword
const port = 80; // Default ONVIF port (change if necessary)

type CreateOnvif = z.infer<typeof createOnvifSchema>;

const probeDevice = async (ip: string) => {
  const device = new OnvifDevice({
    xaddr: `http://${ip}:${port}/onvif/device_service`, // Device's ONVIF endpoint
    user: username, // Device's username
    pass: password, // Device's password
  });

  try {
    await device.init(); // Initialize the connection
    console.log(`Device found at ${ip}`);
    const deviceInfo = device.getInformation();
    if (deviceInfo.Manufacturer) {
      const deviceInfoWithIp = { ...deviceInfo, ip: ip };
      console.log("deviceInfoWithIp =>", deviceInfoWithIp);
      return deviceInfoWithIp;
    }
  } catch (err: any) {
    console.warn(`Error connecting to device at ${ip}:`, err.message || err);
    // console.log(`Failed to connect to ${ip}:`, err);
    return null;
  }
};

export const getCamNetwork2 = async (req: Request, res: Response) => {
  const inputData: CreateOnvif = {
    ...req.body,
  };

  console.log(req.body);

  const { ip } = req.body;

  // return { message: "ok" };

  const onvif = createOnvifSchema.safeParse(inputData);

  console.log("Start the discovery process");

  // const ipRange = ["192.168.90.180", "192.168.90.190"]; // Define your custom IP range
  const cleanedIpString = ip.replace(/\s+/g, "");
  const ipRange = cleanedIpString.includes("-")
    ? cleanedIpString.split("-")
    : [cleanedIpString, cleanedIpString];
  console.log("ipRangeString => ", ipRange);

  const [startIp, endIp] = ipRange;
  const startOctets = startIp.split(".");
  const endOctets = endIp.split(".");

  const baseIp = `${startOctets[0]}.${startOctets[1]}.${startOctets[2]}`;

  try {
    const deviceInfoList: { [k: string]: any } = [];
    for (let i = parseInt(startOctets[3]); i <= parseInt(endOctets[3]); i++) {
      const ip = `${baseIp}.${i}`; // Adjust for your IP range
      const deviceInfo = await probeDevice(ip);
      if (deviceInfo) {
        deviceInfoList.push(deviceInfo);
      }
    }
    // Send a successful response
    return res.status(200).json({
      success: true,
      message: "Successfully found devices",
      data: deviceInfoList,
    });
  } catch (error) {
    // Send an error response
    return res.status(404).json({
      success: false,
      message: "Cannot find devices",
      error: error,
    });
  }
};
