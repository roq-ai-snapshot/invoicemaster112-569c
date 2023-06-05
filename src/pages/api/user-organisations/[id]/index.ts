import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { userOrganisationValidationSchema } from 'validationSchema/user-organisations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.user_organisation
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getUserOrganisationById();
    case 'PUT':
      return updateUserOrganisationById();
    case 'DELETE':
      return deleteUserOrganisationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getUserOrganisationById() {
    const data = await prisma.user_organisation.findFirst(convertQueryToPrismaUtil(req.query, 'user_organisation'));
    return res.status(200).json(data);
  }

  async function updateUserOrganisationById() {
    await userOrganisationValidationSchema.validate(req.body);
    const data = await prisma.user_organisation.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteUserOrganisationById() {
    const data = await prisma.user_organisation.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
