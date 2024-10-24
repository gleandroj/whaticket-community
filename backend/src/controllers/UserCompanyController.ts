import { Request, Response } from "express";
import ShowUserService from "../services/UserServices/ShowUserService";

//Troca de compania
export const switchUserCompany = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id!;
    const companyId: number = +req.params.companyId!;

    // Busca o usuário logado e suas companhias
    const user = await ShowUserService(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    let hasActivatedSomeCompany = false;

    // Percorre todas as companhias associadas ao usuário
    const userCompanyUpdates = user.companies.map(company => {
      const isActive = company.id === companyId; // Verifica se esta é a companhia ativa });
      hasActivatedSomeCompany = hasActivatedSomeCompany || isActive;
      return company.UserCompany.update({ isActive });
    });

    // Aguarda todas as atualizações serem concluídas
    await Promise.all(userCompanyUpdates);

    return res
      .status(200)
      .json({ message: "Companhia ativa alterada com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const listUserComapany = async (req: Request, res: Response) => {
  //Popular o comboexport const listUserCompany = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id!;
    // Busca o usuário logado e suas companhias
    const user = await ShowUserService(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json(
      user.companies.map(company => ({
        id: company.id,
        name: company.name,
        isActive: company.UserCompany.isActive
      }))
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
};
