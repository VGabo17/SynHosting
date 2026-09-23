import { ServiceStatus, type Service } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ProvisionResult = {
  status: ServiceStatus;
  nodeId: string | null;
  containerId: string | null;
  ipAddress: string | null;
  port: number | null;
};

/**
 * Contract that a real orchestration backend (Docker/Pterodactyl/Nomad) has to
 * implement. The MVP ships a simulated driver so the product flows work before
 * the infrastructure layer exists.
 */
export interface Provisioner {
  provision(service: Service): Promise<ProvisionResult>;
  start(service: Service): Promise<ServiceStatus>;
  stop(service: Service): Promise<ServiceStatus>;
  destroy(service: Service): Promise<void>;
}

const PORT_RANGE_START = 25565;

class SimulatedProvisioner implements Provisioner {
  async provision(service: Service): Promise<ProvisionResult> {
    const node = await prisma.node.findFirst({
      where: { status: "ONLINE" },
      orderBy: { services: { _count: "asc" } },
    });

    const usedPorts = await prisma.service.count({
      where: { nodeId: node?.id ?? undefined },
    });

    return {
      status: node ? ServiceStatus.RUNNING : ServiceStatus.PROVISIONING,
      nodeId: node?.id ?? null,
      containerId: node ? `sim-${service.id.slice(0, 12)}` : null,
      ipAddress: node?.hostname ?? null,
      port: node ? PORT_RANGE_START + usedPorts : null,
    };
  }

  async start(): Promise<ServiceStatus> {
    return ServiceStatus.RUNNING;
  }

  async stop(): Promise<ServiceStatus> {
    return ServiceStatus.STOPPED;
  }

  async destroy(): Promise<void> {}
}

export const provisioner: Provisioner = new SimulatedProvisioner();
