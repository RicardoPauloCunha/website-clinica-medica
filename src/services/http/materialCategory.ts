import CategoriaMaterial from "../entities/categoriaMaterial";

export const _listMaterialCategory: CategoriaMaterial[] = [
    {
        idCategoriaMaterial: 1,
        nome: "Equipamento Diagnóstico"
    },
    {
        idCategoriaMaterial: 2,
        nome: "Equipamento de Terapia"
    },
    {
        idCategoriaMaterial: 3,
        nome: "Equipamento de Apoio Médico-Hospitalar"
    },
    {
        idCategoriaMaterial: 4,
        nome: "Materiais Descartáveis"
    },
    {
        idCategoriaMaterial: 5,
        nome: "Materiais Implantáveis"
    },
    {
        idCategoriaMaterial: 6,
        nome: "Produtos para Diagnóstico de Uso “In-Vitro”"
    }
];

export const listMaterialCategoryHttp = async (): Promise<CategoriaMaterial[]> => {
    return _listMaterialCategory;
}